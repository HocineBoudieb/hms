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
      },
    });
    res.json(encours);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch EnCours." });
  }
});

// Get all Workshops
app.get("/workshops", async (req, res) => {
  try {
    console.log("Fetching workshops...");
    const workshops = await prisma.workshop.findMany({
      include: {
        EnCours: true,
      },
    });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workshops." });
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
