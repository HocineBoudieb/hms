const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());
// Helper function to calculate time difference in days
function calculateDaysDifference(startDate) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(startDate));
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

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
        Rfid: true,
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
    console.log("Fetching workshops...");
    const workshops = await prisma.workshop.findMany({
      include: {
        EnCours: true,
        Rfid: true,
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
        EnCours: true,
        Workshop: true,
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
app.post("/antennas/:id/rfids", async (req, res) => {
  const { id } = req.params; // Antenna ID
  const { rfids, timestamp } = req.body; // Array of RFID IDs & Timestamp

  if (!rfids || !timestamp) {
    return res.status(400).json({ error: "RFIDs and timestamp are required." });
  }

  try {
    const antennaId = parseInt(id);
    const detectedRfids = new Set(rfids); // Use a set for fast lookups

    // Fetch current RFIDs in this antenna's EnCours
    const enCours = await prisma.enCours.findUnique({
      where: { antennaId },
      include: { Rfid: true },
    });

    if (!enCours) {
      return res.status(404).json({ error: "EnCours not found for this antenna." });
    }

    const currentRfids = new Set(enCours.Rfid.map(rfid => rfid.id));

    // Calculate changes
    const enteredRfids = [...detectedRfids].filter(rfid => !currentRfids.has(rfid));
    const exitedRfids = [...currentRfids].filter(rfid => !detectedRfids.has(rfid));

    // Process entered RFIDs
    for (const rfidId of enteredRfids) {
      await prisma.event.create({
        data: {
          rfidOrderId: rfidId,
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
    }

    // Process exited RFIDs
    for (const rfidId of exitedRfids) {
      await prisma.event.create({
        data: {
          rfidOrderId: rfidId,
          timestamp: new Date(timestamp),
          eventType: 0, // 0 for "quit"
        },
      });

      await prisma.rfid.update({
        where: { id: rfidId },
        data: {
          enCoursId: null,
          workshopId: null, // Reset location when leaving
        },
      });
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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
