// FILE: node_api/index.js

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());


// Helper functions

/**
 * @function getLastEventTimestamp
 * @description Returns the timestamp of the last event for the given order id
 * @param {number} orderId - The id of the order
 * @returns {number} The timestamp of the last event
 */
async function getLastEventTimestamp(orderId) {
  const lastEvent = await prisma.event.findMany({
    where: {
      orderId: orderId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
  return lastEvent[0].timestamp;
}
/**
 * @function calculateMinutesDifference
 * @description Returns the time difference between the current timestamp and a given timestamp in minutes
 * @param {number} lastEventTimestamp - The timestamp from which to calculate the difference
 * @returns {number} The time difference in minutes
 */
async function calculateMinutesDifference(lastEventTimestamp) {
  const now = new Date();
  const diffTime = Math.abs(now - lastEventTimestamp);
  const res = Math.ceil(diffTime / (1000 * 60));
  return res;
}

//************************************************************
//GET REQUESTS ***********************************************
//************************************************************
// Get all Antennas
app.get("/antennas", async (req, res) => {
  try {
    const antennas = await prisma.antenna.findMany();
    res.json(antennas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch antennas." });
  }
});

// Get all EnCours
app.get("/encours", async (req, res) => {
  try {
    const encours = await prisma.enCours.findMany({
      include: {
        Antenna: true,
        Order: true,
      },
    });
    res.json(encours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch EnCours." });
  }
});

//Get en-cours by id
app.get("/encours/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const encours = await prisma.enCours.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Antenna: true,
        Rfid: true,
      },
    });
    res.json(encours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch EnCours." });
  }
});

//get all orders in en-cours id
app.get("/encours/:id/orders", async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: {
        enCoursId: parseInt(id),
      },
      include: {
        RfidOrder: true,
        Alert: true,
        Support: true,
      },
    });
    const ordersWithDurationSinceLastEvent = await Promise.all(
      orders.map(async (order) => {
        const lastEventTimestamp = await getLastEventTimestamp(order.id);
        const minutesDifference = await calculateMinutesDifference(lastEventTimestamp);
        return {
          ...order,
          daysSinceCreation: minutesDifference,
        };
      })
    );
    res.json(ordersWithDurationSinceLastEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// Get all Workshops
app.get("/workshops", async (req, res) => {
  try {
    const workshops = await prisma.workshop.findMany({
      include: {
        EnCours: true,
        Order: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workshops." });
  }
});
// workshop x endpoint
app.get("/workshops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await prisma.workshop.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        EnCours: true,
      },
    });
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workshop." });
  }
});
//Get orders by workshop
app.get("/workshops/:id/orders", async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await prisma.order.findMany({
      where: {
        workshopId: parseInt(id),
      },
      include: {
        RfidOrder: true,
        Alert: true,
        Support: true,
      },
    });
    const ordersWithDurationSinceLastEvent = await Promise.all(
      orders.map(async (order) => {
        const lastEventTimestamp = await getLastEventTimestamp(order.id);
        const minutesDifference = await calculateMinutesDifference(lastEventTimestamp);
        return {
          ...order,
          daysSinceCreation: minutesDifference,
        };
      })
    );
    
    console.log(ordersWithDurationSinceLastEvent);
    res.json(ordersWithDurationSinceLastEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});
// Get all Orders with time since creation
app.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        RfidOrder: true,
        Alert: true,
        Support: true,
      },
    });
    const ordersWithDurationSinceLastEvent = await Promise.all(
      orders.map(async (order) => {
        const lastEventTimestamp = await getLastEventTimestamp(order.id);
        const minutesDifference = await calculateMinutesDifference(lastEventTimestamp);
        return {
          ...order,
          daysSinceCreation: minutesDifference,
        };
      })
    );
    res.json(ordersWithDurationSinceLastEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// Get all Artisans with total working hours
app.get("/artisans", async (req, res) => {
  try {
    const artisans = await prisma.artisan.findMany({
      include: {
        Support: true,
      },
    });
    const artisansWithStats = artisans.map(artisan => {
      const totalWorkingHours = artisan.Support.reduce((sum, support) => {
        const hours = Math.abs(new Date(support.endDate) - new Date(support.startDate)) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      return {
        ...artisan,
        totalWorkingHours,
      };
    });
    res.json(artisansWithStats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artisans." });
  }
});

// Get all Events
app.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        Order: true,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

//Get order last event
app.get("/orders/:id/last-event", async (req, res) => {
  try {
    const { id } = req.params;
    const events = await prisma.event.findMany({
      where: {
        orderId: parseInt(id),
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch last event." });
  }
});

// Get all Rfids
app.get("/rfids", async (req, res) => {
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
});

//Get all supports
app.get("/supports", async (req, res) => {
  try {
    const supports = await prisma.support.findMany({
      include: {
        Artisan: true,
        Order: true
      },
    });
    res.json(supports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supports." });
  }
});

//get alerts
app.get("/alerts",async (req,res) => {
  try{
      const alerts = await prisma.alert.findMany();
      res.json(alerts);
  }catch (error) {
      res.status(500).json({error: "Failed to fetch alerts"});
  }
});

//get active alerts
app.get("/alerts/active",async (req,res) => {
  try{
      const alerts = await prisma.alert.findMany({
        where: {
          status: 1
        }
      });
      res.json(alerts);
  }catch (error) {
      res.status(500).json({error: "Failed to fetch alerts"});
  }
});

//Get all stats
app.get("/stats", async (req, res) => {
  try {
    const stats = await prisma.stats.findMany();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});


//Get all time
app.get("/time", async (req, res) => {
  try {
    const time = await prisma.time.findMany();
    res.json(time);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time." });
  }
});


//************************************************************
//POST REQUESTS **********************************************
//************************************************************

// Create a new Workshop

// DOCUMENTATION
/*
/workshops endpoint POST request to create a new workshop with the following parameters:
@params
- name: The workshop name.
- startDate: The workshop start date.
- endDate: The workshop end date.
- EnCoursId: The EnCours ID.
@returns The created workshop.
*/
app.post("/workshops", async (req, res) => {
    try {
        const { name, startDate, endDate, EnCoursId } = req.body;
        const workshop = await prisma.workshop.create({
        data: {
            name,
            startDate,
            endDate,
            EnCoursId,
        },
        });
        res.json(workshop);
    } catch (error) {
        res.status(500).json({ error: "Failed to create workshop." });
    }
    });

// Handle RFID detection from Antenna
// DOCUMENTATION
/** 
/antennas/:id/rfids endpoint POST request to handle RFID detection from an antenna with the following parameters:
@params
- id: The Antenna ID.
@body
- rfids: An array of RFID IDs.
- timestamp: The detection timestamp.
@returns The processed RFID detection.
*/
app.post("/antennas/:id/rfids", async (req, res) => {
  const { id } = req.params; // Antenna ID
  const { rfids, timestamp } = req.body; // Array of RFID IDs & Timestamp

  if(id === '0'){
    console.log("registering rfids");
    try {
      const createdRfids = await Promise.all(
        rfids.map(rfid => prisma.rfid.create({ data: {
            reference: rfid,
          } }))
      );
      res.json(createdRfids);
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
          await prisma.order.update({
            where: { rfidOrderId: rfidorderId },
            data: {
              enCoursId: null,
            },
          });
          
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
});

//Order creation by rfid create automatically an rfidorder
//DOCUMENTATION
/*
/orders endpoint POST request to create a new order with the following parameters:
@params
- rfidId: The RFID reference.
- startDate: The order start date.
- endDate: The order end date.
- status: The order status.
- enCoursId: The EnCours ID.
- workshopId: The Workshop ID.
@returns The created order.
*/
app.post("/orders", async (req, res) => {
  try {
    const { rfidId, startDate, endDate, status, enCoursId, workshopId } = req.body;
    //get rfidId from the rfid reference
    const rfid = await prisma.rfid.findFirst({
      where: {
        reference: rfidId,
      },
    });
    const idrfid = rfid.id;
    const rfidorder = await prisma.rfidOrder.create({
      data: {
        status: 1, // 1 for "active"
        },
    });

    const order = await prisma.order.create({
      data: {
        status: 1, // 1 for "active"
        startDate: new Date(startDate),
        endDate: null,
        enCoursId: 22,
        workshopId: null,
        rfidOrderId: rfidorder.id,
      },
    });
    //update rfid to put rfidorderId
    await prisma.rfid.update({
      where: { id: idrfid },
      data: {
        rfidOrderId: rfidorder.id,
      },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
});

// Create a new Support
// DOCUMENTATION
/*
/supports endpoint POST request to create a new support with the following parameters:
@params
- startDate: The support start date.
- endDate: The support end date.
- artisanId: The Artisan ID.
- orderId: The Order ID.
@returns The created support.
*/
app.post("/supports", async (req, res) => {
  try {
    const { rfidId, type, artisan } = req.body;
    //Get order from rfid ref
    const rfid = await prisma.rfid.findFirst({
      where: {
        reference: rfidId,
      },
    });
    const rfidorderId = rfid.rfidOrderId;
    const order = await prisma.order.findUnique({
      where: {
        rfidOrderId: rfidorderId,
      },
    });
    //get order last localization from last event
    const event = await prisma.event.findMany({
      where: {
        orderId: order.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    const lastEvent = event[0];
    const enCoursId = lastEvent.enCoursId;

    const Workshop = await prisma.workshop.findFirst({
      where: {
        enCoursId: enCoursId,
      },
    });
    //Assign workshop to order
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        workshopId: Workshop.id,
      },
    });
    await prisma.rfid.update({
      where: {
        id: rfid.id,
      },
      data: {
        workshopId: Workshop.id,
      }
    })
    //Get artisan from artisan name
    const artisan_instance = await prisma.artisan.findFirst({
      where: {
        name: artisan,
      },
    });
    const support = await prisma.support.create({
      data: {
        orderId: order.id,
        artisanId: artisan_instance.id,
        workshopId: Workshop.id,
        type: parseInt(type.split(" ")[1]),
        startDate: new Date(),
        endDate: null,
      },
    });
    res.json(support);
  } catch (error) {
    res.status(500).json({ error: "Failed to create support." });
  }
});


//****************************************************************
//ALERTS MANAGEMENT
//****************************************************************


/**
 * Create an alert for a given order and type, if it doesn't already exist.
 * @param {number} orderId The order ID.
 * @param {number} type The type of the alert.
 */
async function createAlert(orderId, type) {
  console.log("entered alert creation");
  //if alert already exists for this order with the same type, do nothing
  const existingAlert = await prisma.alert.findFirst({
    where: {
      orderId: orderId,
      type: type,
      status: 1,
    },
  });
  if (existingAlert) {
    console.log("Alert already exist");
    return;
  }
  console.log("Creating Alert");
  await prisma.alert.create({
    data: {
      orderId: orderId,
      type: type,
      status: 1,
      startDate: new Date(),
    },
  });
  console.log("Alert Created");
}

/**
 * Resolve an alert by setting its status to 0 and its end date to the current
 * timestamp.
 * @param {number} alertId The ID of the alert to resolve.
 */
async function resolveAlert(alertId) {
  await prisma.alert.update({
    where: {
      id: alertId,
    },
    data: {
      status: 0,
      endDate: new Date(),
    },
  });
}

/**
 * Check for anomalies in the orders and create alerts if necessary.
 * Anomalies are defined as:
 * - An order is in an encours and in a workshop
 * - An order is not in an encours and not in a workshop for more than 10 seconds
 * Also, check if the anomalies are resolved and close the corresponding alerts
 */
async function checkForAnomalies() {
  //Check if an order is in an encours and in a workshop
  const orders = await prisma.order.findMany();
  const ordersWithTwoLocationsAnomalies = orders.filter(order => order.enCoursId && order.workshopId);

  //Check if an order is not in an encours and not in a workshop for more than 10 seconds
  const now = new Date();
  const tenSecondsAgo = new Date(now.getTime() - 10000);
  const ordersWithoutLocation = orders.filter(order => !order.enCoursId && !order.workshopId);
  const ordersWithoutLocationAnomalies = [];
  //check if these orders last event is more than 10 seconds ago
  for (const order of ordersWithoutLocation) {
    const events = await prisma.event.findMany({
      where: {
        orderId: order.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    const lastEvent = events[0];
    const lastEvent_timestamp = new Date(lastEvent.timestamp);
    console.log("last event timestamp", lastEvent_timestamp);

    if (lastEvent_timestamp < tenSecondsAgo) {
      ordersWithoutLocationAnomalies.push(order);
    }
  }
  //Create alerts for the anomalies
  for(const order of ordersWithTwoLocationsAnomalies){
    createAlert(order.id, 1);
  }
  for(const order of ordersWithoutLocationAnomalies){
    createAlert(order.id, 2);
  }

  //Check if Anomalies are resolved
  const alerts = await prisma.alert.findMany({
    where: {
      status: 1,
    },
  });
  const resolvedAlerts = [];
  for(const alert of alerts){
    const order = await prisma.order.findUnique({
      where: {
        id: alert.orderId,
      },
    });
    //check type of alert
    if(alert.type === 1){
      //check if order is in an encours or in a workshop but not in both (exclusive or)
      if((order.enCoursId && !order.workshopId) || (!order.enCoursId && order.workshopId)){
        resolvedAlerts.push(alert.id);
      }
    }
    else{
      //check if order is in an encours or in a workshop
      if(order.enCoursId || order.workshopId){
        resolvedAlerts.push(alert.id);
      }
    }
  }
  for(const alertId of resolvedAlerts){
    resolveAlert(alertId);
  }

}


setInterval(checkForAnomalies, 5000);

//****************************************************************
//STATS MANAGEMENT
//****************************************************************
//function to convert timestamp difference to hour or minutes depending on the difference
function timestampToBestUnit(timestamp) {
  const diffTime = timestamp
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes`;
  } else {
    return `${diffHours} hours`;
  }
}



/**
 * Updates the average time in encours and workshops in the stats table
 * by querying the time table and calculating the difference from the current value
 * in the stats table.
 */
async function update_Stats(){

  //Update Average time in encours, by getting total times in time table where enCoursId is not null
  const aggregate_time_in_encours = await prisma.time.aggregate({
    _sum: {
      duration: true,
    },
    where: {
      enCoursId: {
        not: null,
      },
    },
  });
  const total_time_in_encours = aggregate_time_in_encours._sum.duration;
  //get the current value in stats table
  const current_total_time_in_encours = await prisma.stats.findUnique({
    where: {
      id: 6,
    },
  });
  const current_total_time_in_encours_value = parseInt(current_total_time_in_encours.value, 10);
  //calculate the difference in percentage
  let value_unit = timestampToBestUnit(total_time_in_encours); //"X hours"
  //check if current stat value is different from the new value
  if(current_total_time_in_encours.value !== parseInt)
  {
    const difference_encours = current_total_time_in_encours_value === 0 ? 0 : (parseInt(value_unit, 10) - current_total_time_in_encours_value) / current_total_time_in_encours_value * 100;
    //update the stat table
    await prisma.stats.update({
      where: {
        id: 6,
      },
      data: {
        value: parseInt(value_unit, 10),
        change: Math.abs(difference_encours),
        unit: value_unit.split(" ")[1],
        isUp: difference_encours < 0 ? false : true,
        lastTime: new Date(),
      },
    });
  }


  //Update Average time in workshop, by getting total times in time table where workshopId is not null
  const aggregate_time_in_workshop = await prisma.time.aggregate({
    _sum: {
      duration: true,
    },
    where: {
      workshopId: {
        not: null,
      },
    },
  });
  const total_time_in_workshop = aggregate_time_in_workshop._sum.duration;
  //get the current value in stats table
  const current_total_time_in_workshop = await prisma.stats.findUnique({
    where: {
      id: 1,
    },
  });
  
  const current_total_time_in_workshop_value = parseInt(current_total_time_in_workshop.value, 10);
  value_unit = timestampToBestUnit(total_time_in_workshop);

  if(current_total_time_in_workshop.value !== parseInt(value_unit, 10))
  {
      
    //calculate the difference in percentage
    const difference_workshop = current_total_time_in_workshop_value === 0 ? 0 : Math.abs(((parseInt(timestampToBestUnit(total_time_in_workshop), 10) - current_total_time_in_workshop_value) / current_total_time_in_workshop_value) * 100);
    
    //update the stat table
    await prisma.stats.update({
      where: {
        id: 1,
      },
      data: {
        value: parseInt(value_unit, 10),
        change: difference_workshop,
        unit: value_unit.split(' ')[1]
      },
    });
  }
}


setInterval(update_Stats, 5000);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
