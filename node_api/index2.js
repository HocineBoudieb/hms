const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
import { getAntennas } from "./src/functions/antennas.js";
import { getEnCours, getEnCoursById, getOrdersByEnCoursId } from "./src/functions/encours.js";
import { getWorkshops, getWorkshopById, getOrdersByWorkshopId, createWorkshop } from "./src/functions/workshops.js";
import { getAllOrders, createOrder } from "./src/functions/orders.js";
import { getArtisansWithStats } from "./src/functions/artisans.js";
import { getAllEvents } from "./src/functions/events.js";
import { getAllRfids } from "./src/functions/rfids.js";
import { getAllSupports, createSupport } from "./src/functions/supports.js";
import { getAllAlerts, getActiveAlerts } from "./src/functions/alerts.js";
import { getAllStats } from "./src/functions/stats.js";
import { getAllTimeEntries } from "./src/functions/time.js";

const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());

app.get("/antennas", getAntennas(prisma));
app.get("/encours", getEnCours(prisma));
app.get("/encours/:id", getEnCoursById(prisma));
app.get("/encours/:id/orders", getOrdersByEnCoursId(prisma));
app.get("/workshops", getWorkshops(prisma));
app.get("/workshops/:id", getWorkshopById(prisma));
app.get("/workshops/:id/orders", getOrdersByWorkshopId(prisma));
app.get("/orders", getAllOrders(prisma));
app.get("/artisans", getArtisansWithStats(prisma));
app.get("/events", getAllEvents(prisma));
app.get("/orders/:id/last-event", getLastEventForOrder(prisma));
app.get("/rfids", getAllRfids(prisma));
app.get("/supports", getAllSupports(prisma));
app.get("/alerts", getAllAlerts(prisma));
app.get("/alerts/active", getActiveAlerts(prisma));
app.get("/stats", getAllStats(prisma));
app.get("/time", getAllTimeEntries(prisma));

app.post("/workshops", createWorkshop(prisma));
app.post("/antennas/:id/rfids", processRfidDetection(prisma));
app.post("/orders", createOrder(prisma));
app.post("/supports", createSupport(prisma));



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
