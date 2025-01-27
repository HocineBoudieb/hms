//File: index.js, Desc: Main API file

//***************IMPORTS***************
//routes
import { getAntennas } from "./src/functions/antennas.js";
import { getEnCours, getEnCoursById, getOrdersByEnCoursId } from "./src/functions/encours.js";
import { getWorkshops, getWorkshopById, getOrdersByWorkshopId, createWorkshop } from "./src/functions/workshops.js";
import { getAllOrders,getLastEventForOrder, createOrder, assignOrderToRfid, createSampleOrder } from "./src/functions/orders.js";
import { getArtisansWithStats } from "./src/functions/artisans.js";
import { getAllEvents } from "./src/functions/events.js";
import { getAllRfids, processRfidDetection, getTrolleysRfids } from "./src/functions/rfids.js";
import { getAllSupports, createSupport } from "./src/functions/supports.js";
import { getAllAlerts, getActiveAlerts } from "./src/functions/alerts.js";
import { getAllStats } from "./src/functions/stats.js";
import { getAllTimeEntries } from "./src/functions/time.js";

//routines
import { checkForAnomalies } from "./src/routines/alerts.js";   

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

//***************VARIABLES***************
const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());

let isScanning = false;
let currentNFC = null;
//***************ROUTES***************


//***************GET REQUESTS***************

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
app.get("/rfids/trolleys", getTrolleysRfids(prisma));
app.get("/supports", getAllSupports(prisma));
app.get("/alerts", getAllAlerts(prisma));
app.get("/alerts/active", getActiveAlerts(prisma));
app.get("/stats", getAllStats(prisma));
app.get("/time", getAllTimeEntries(prisma));

//***************POST REQUESTS***************
app.post("/workshops", createWorkshop(prisma));
app.post("/antennas/:id/rfids", processRfidDetection(prisma));
app.post("/orders", createOrder(prisma));
app.post("/orders/assign", assignOrderToRfid(prisma));
app.post("/supports", createSupport(prisma));
app.post("/sample", createSampleOrder(prisma));


//***************NFC***************

app.post("/nfc/start-scanning", (req, res) => {
    isScanning = true;
    currentNFC = null;
    res.json({ success: true });
});
app.post("/nfc/stop-scanning", (req, res) => {
    isScanning = false;
    currentNFC = null;
    res.json({ success: true });
});

app.post("/nfc", (req, res) => {
    const { nfcTag } = req.body;
    try {
        if (!isScanning) {
            return res.status(403).json({ message: "NFC scanning is not allowed unless assigning." });
        }

        if (nfcTag) {
            currentNFC = nfcTag;
            res.status(200).json({ message: `NFC tag ${nfcTag} detected and accepted.`, nfcTag });
        } else {
            res.status(400).json({ message: "No NFC tag provided." });
        }
    } catch (error) {
        console.error("Failed to handle NFC scanning:", error);
        res.status(500).json({ message: "Failed to handle NFC scanning." });
    }
});


app.get("/nfc", async (req, res) => {
    try {
        if (!isScanning) {
            return res.status(403).json({ message: "NFC scanning is not allowed unless assigning." });
        }
        if(!currentNFC){
            return res.status(204).json({ message: "NFC tag not scanned yet. wait a few seconds and try again." });
        }

        const artisan = await prisma.artisan.findUnique({ where: { nfcId: currentNFC } });
        res.json(artisan);
    } catch (error) {
        console.error("Failed to handle NFC scanning:", error);
        res.status(500).json({ message: "Failed to handle NFC scanning." });
    }
});
//***************ROUTINES***************

setInterval(() => checkForAnomalies(prisma), 5000);


//***************SERVER***************
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
