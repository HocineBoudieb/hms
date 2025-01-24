import {getLastEventTimestamp} from "../helpers.js";

/**
 * Retrieves all rfids from the database, including associated
 * RfidOrder records.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
export const getAllRfids  = (prisma) => async (req, res) => {
  try {
    const rfids = await prisma.rfid.findMany({
      include: {
        RfidOrder: true,
      },
    });
    res.json(rfids);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rfids." });
  }
};
export const processRfidDetection  = (prisma) => async (req, res) => {
    const { id } = req.params; // Antenna ID
    const { rfids, timestamp } = req.body; // Array of RFID IDs & Timestamp
    console.log("received from antenna", id,"rfids:", rfids,"timestamp:", timestamp);
    if(id === '0'){
    console.log("registering rfids");
    try {
        const createdRfids = await Promise.all(
        rfids.map(rfid => prisma.rfid.create({ data: {
            reference: rfid,
            } }))
        );
        res.status(200).json(createdRfids);
    } catch (error) {
        res.status(500).json({ error: "Failed to register RFIDs." });
    }
    }
    else{
    if (!rfids || !timestamp) {
        return res.status(400).json({ error: "RFIDs and timestamp are required." });
    }
    try {
        const antennaId = parseInt(id);
        //rfids are the references of the rfids
        //get list of rfids with the references
        const rfidsList = await prisma.rfid.findMany({
        where: {
            reference: {
            in: rfids,
            },
        },
        });
        const detectedRfids = rfidsList.map(rfid => rfid.id);

        // Fetch current RFIDs in this antenna's EnCours
        const antenna = await prisma.antenna.findUnique({
        where: { reference: antennaId },
        });
        const enCours = await prisma.enCours.findUnique({
        where: { antennaId: antenna.id },
        include: {
            Order: {
            include: {
                RfidOrder: true,
            },
            },
        },
        });

        if (!enCours) {
        return res.status(404).json({ error: "EnCours not found for this antenna." });
        }
        const currentRfids = await prisma.rfid.findMany({
        where: {
            enCoursId: enCours.id,
        },
        });
        const currentRfidsList = currentRfids.map(rfid => rfid.id);
        const enteredRfids = detectedRfids.filter(rfidId => !currentRfidsList.includes(rfidId));
        const exitedRfids = currentRfidsList.filter(rfidId => !detectedRfids.includes(rfidId));
        
    
        // Calculate changes
        // Process entered RFIDs into EnCours
        if(enteredRfids.length > 0){
        for (const rfidId of enteredRfids) {
            //get rfid from rfidId
            const rfid = await prisma.rfid.findUnique({
            where: { id: rfidId },
            });
            //get rfidorder from rfid
            const rfidorderid = rfid.rfidOrderId;
            const order = await prisma.order.findUnique({
            where: { rfidOrderId: rfidorderid },
            });

            //check if the order is in a workshop
            if (order.workshopId) {
            //Put last support endate to now
            const support = await prisma.support.findFirst({
                where: {
                orderId: order.id,
                },
                orderBy: {
                startdate: 'desc',
                },
            });
            const supportId = support[0].id;
            await prisma.support.update({
                where: { id: supportId },
                data: {
                enddate: new Date(timestamp),
                },
            })
            //get last event timestamp
            const lastEventTimestamp = await getLastEventTimestamp(order.id);
            //create time
            await prisma.time.create({
                data: {
                orderId: order.id,
                duration: new Date()-lastEventTimestamp,
                workshopId: order.workshopId
                },
            });
            }

            await prisma.event.create({
            data: {
                orderId: order.id,
                enCoursId: enCours.id,
                timestamp: new Date(timestamp),
                eventType: 1, // 1 for "come"
            },
            });
            
            await prisma.rfid.update({
            where: { id: rfidId },
            data: {
                enCoursId: enCours.id,
                workshopId: null, // Reset workshop if moving into EnCours
            },
            });
            //update en-cours in order order
            await prisma.order.update({
            where: { rfidOrderId: rfidorderid },
            data: {
                status: 1,
                enCoursId: enCours.id,
                workshopId: null,
            },
            });

        }
        }
        // Process exited RFIDs from EnCours
        if(exitedRfids.length > 0){
            for (const rfidId of exitedRfids) {
                const rfid = await prisma.rfid.findUnique({
                where: { id: rfidId },
                });
                const rfidorderId = rfid.rfidOrderId;
                const order = await prisma.order.findUnique({
                where: { rfidOrderId: rfidorderId },
                });
                //Get last event timestamp
                const lastEventTimestamp = await getLastEventTimestamp(order.id);
                //Create new time row with the time taken by the order in the en-cours
                await prisma.time.create({
                data: {
                    orderId: order.id,
                    duration: new Date()-lastEventTimestamp.getTime(),
                    enCoursId: enCours.id
                },
                });
                await prisma.event.create({
                data: {
                    orderId: order.id,
                    enCoursId: enCours.id,
                    timestamp: new Date(timestamp),
                    eventType: 0, // 0 for "quit"
                },
                });
                await prisma.rfid.update({
                where: { id: rfidId },
                data: {
                    enCoursId: null,//Reset en-cours while exiting
                    workshopId: null,
                },
                });
                //if len of encours.Workshop is 0 so this is the last antenna, mark the order as done
                if(enCours.Workshop.length == 0){
                    await prisma.order.update({
                    where: { rfidOrderId: rfidorderId },
                    data: {
                        status: 2,
                    },
                    });
                    
                }
                else{
                    await prisma.order.update({
                    where: { rfidOrderId: rfidorderId },
                    data: {
                        enCoursId: null,
                    },
                    });
                }
                
            }
        }
        res.json({
        message: "RFID detection processed successfully.",
        enteredRfids,
        exitedRfids,
        });
    } catch (error) {
        console.error("Error processing RFID detection:", error);
        res.status(500).json({ error: "Failed to process RFID detection." });
    }
    }
}

/**
 * Retrieves all RFIDs with a trolley number and without an associated RFID Order.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
export const getTrolleysRfids = (prisma) => async (req, res) => {
    try {
      const rfids = await prisma.rfid.findMany(
        {
          where: {
            trolley: {
              not: null,
            },
            rfidOrderId: null,
          },
        }
      );
      const data = rfids.map((rfid) => ({
        id: rfid.id,
        trolley: rfid.trolley,
      }));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rfids." });
    }
  };