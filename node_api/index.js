const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());
// Helper functions

function calculateDaysDifference(startDate) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function update_Stats(){
  //calculate mean support duration
  allSupports = prisma.support.findMany();
  meanDuration = allSupports.reduce((sum, support) => {
    const hours = Math.abs(new Date(support.endDate) - new Date(support.startDate)) / (1000 * 60 * 60);
    return sum + hours;
  }, 0) / allSupports.length;
  //update Stats table
  prisma.stats.update({
    where: { id: 1 },
    data: {
      meanSupportDuration: meanDuration,
    },
  });

  //calculate mean working hours per day
  //divide total working hours by the number of days
  


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
    const ordersWithStats = orders.map(order => ({
      ...order,
      daysSinceCreation: calculateDaysDifference(order.startDate),
    }));
    res.json(ordersWithStats);
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
    const ordersWithStats = orders.map(order => ({
      ...order,
      daysSinceCreation: calculateDaysDifference(order.startDate),
    }));
    res.json(ordersWithStats);
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
    const ordersWithStats = orders.map(order => ({
      ...order,
      daysSinceCreation: calculateDaysDifference(order.startDate),
    }));
    res.json(ordersWithStats);
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
        RfidOrder: true,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
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

//Get mean support duration
app.get("/supports/mean", async (req, res) => {
  try {
    const supports = await prisma.support.findMany();
    const meanDuration = supports.reduce((sum, support) => {
      const hours = Math.abs(new Date(support.endDate) - new Date(support.startDate)) / (1000 * 60 * 60);
      return sum + hours;
    }, 0) / supports.length;
    res.json({ meanDuration });
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

//************************************************************
//POST REQUESTS
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
/*
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
  console.log("received rfids",rfids, "from antenna", id);

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

      //log the entered and exited rfids
      console.log("current rfids", currentRfidsList);
      console.log("entered rfids", enteredRfids);
      console.log("exited rfids", exitedRfids);



      // Calculate changes
      // Process entered RFIDs into EnCours
      if(enteredRfids.length > 0){
        for (const rfidId of enteredRfids) {
          console.log("rfidId", rfidId);
          //get rfid from rfidId
          const rfid = await prisma.rfid.findUnique({
            where: { id: rfidId },
          });
          //get rfidorder from rfid
          const rfidorderid = rfid.rfidOrderId;
          const order = await prisma.order.findUnique({
            where: { rfidOrderId: rfidorderid },
          });


          await prisma.event.create({
            data: {
              orderId: order.id,
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
      // Process exited RFIDs into Workshop
      if(exitedRfids.length > 0){
        console.log("Processing exited rfids...");
        for (const rfidId of exitedRfids) {
          const rfid = await prisma.rfid.findUnique({
            where: { id: rfidId },
          });
          const rfidorderId = rfid.rfidOrderId;
          const order = await prisma.order.findUnique({
            where: { rfidOrderId: rfidorderId },
          });
          await prisma.event.create({
            data: {
              orderId: order.id,
              timestamp: new Date(timestamp),
              eventType: 0, // 0 for "quit"
            },
          });
          //find worhsop with the en-cours id
          const workshop = await prisma.workshop.findFirst({
            where: { enCoursId: enCours.id },
          });
          await prisma.order.update({
            where: { rfidOrderId: rfidorderId },
            data: {
              enCoursId: null,
              workshopId: workshop.id,
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
    console.log("rfid", rfid);
    const idrfid = rfid.id;
    const rfidorder = await prisma.rfidOrder.create({
      data: {
        status: 1, // 1 for "active"
        },
    });
    console.log("rfidorder", rfidorder);

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
    console.log("order", order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
