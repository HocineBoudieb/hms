//File: index.js, Desc: Main API file

//***************IMPORTS***************
//routes
import { getAntennas } from "./src/functions/antennas.js";
import { getEnCours, getEnCoursById, getOrdersByEnCoursId } from "./src/functions/encours.js";
import { getWorkshops, getWorkshopById, getOrdersByWorkshopId, createWorkshop, getWorkshopActivities } from "./src/functions/workshops.js";
import { getAllOrders,getLastEventForOrder, createOrder, assignOrderToRfid, createSampleOrder } from "./src/functions/orders.js";
import { getArtisansWithStats } from "./src/functions/artisans.js";
import { getAllEvents } from "./src/functions/events.js";
import { getAllRfids, processRfidDetection, getTrolleysRfids } from "./src/functions/rfids.js";
import { getAllSupports, createSupport } from "./src/functions/supports.js";
import { getAllAlerts, getActiveAlerts } from "./src/functions/alerts.js";
import { getAllStats } from "./src/functions/stats.js";
import { getAllTimeEntries } from "./src/functions/time.js";
import { getAllProducts, getProductById } from "./src/functions/products.js";
import { getAllActivities, getActivityById } from "./src/functions/activities.js";
import { getStdTimes } from "./src/functions/stdtime.js";
//routines
import { checkForAnomalies } from "./src/routines/alerts.js";   
import { updateStats} from "./src/routines/stats.js";

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

//***************VARIABLES***************
const prisma = new PrismaClient();
const app = express();
const port = 8081;

app.use(express.json());
app.use(cors());

//***************ROUTES***************


//***************GET REQUESTS***************

app.get("/antennas", getAntennas(prisma));
app.get("/encours", getEnCours(prisma));
app.get("/encours/:id", getEnCoursById(prisma));
app.get("/encours/:id/orders", getOrdersByEnCoursId(prisma));
app.get("/workshops", getWorkshops(prisma));
app.get("/workshops/:id", getWorkshopById(prisma));
app.get("/workshops/:id/orders", getOrdersByWorkshopId(prisma));
app.get("/workshops/:id/activities", getWorkshopActivities(prisma));
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
app.get("/products", getAllProducts(prisma));
app.get("/products/:id", getProductById(prisma));
app.get("/activities", getAllActivities(prisma));
app.get("/activities/:id", getActivityById(prisma));
app.get("/stdtime",getStdTimes(prisma));

//***************POST REQUESTS***************
app.post("/workshops", createWorkshop(prisma));
app.post("/antennas/:id/rfids", processRfidDetection(prisma));
app.post("/orders", createOrder(prisma));
app.post("/orders/assign", assignOrderToRfid(prisma));
app.post("/supports", createSupport(prisma));
app.post("/sample", createSampleOrder(prisma));


//***************NFC GLOBAL VARIABLES***************

// Store scanning state for multiple workshops
let workshopScanningState = {}; // { [workshopId]: { isScanning: boolean, currentNFC: string|null } }

//***************NFC***************

// Start scanning for a specific workshop
app.post("/nfc/:workshopId/start-scanning", (req, res) => {
    console.log("start scanning...");
    const { workshopId } = req.params;
    if (!workshopScanningState[workshopId]) {
        workshopScanningState[workshopId] = { isScanning: true, currentNFC: null };
        console.log("workshopScanningState",workshopScanningState);
    } else {
        workshopScanningState[workshopId].isScanning = true;
        workshopScanningState[workshopId].currentNFC = null;
    }
    res.json({ success: true, message: `Started scanning for workshop ${workshopId}` });
});

// Stop scanning for a specific workshop
app.post("/nfc/:workshopId/stop-scanning", (req, res) => {
    const { workshopId } = req.params;
    if (workshopScanningState[workshopId]) {
        workshopScanningState[workshopId].isScanning = false;
        workshopScanningState[workshopId].currentNFC = null;
    }
    res.json({ success: true, message: `Stopped scanning for workshop ${workshopId}` });
});

// Handle NFC detection for a specific workshop
app.post("/nfc/:workshopId", (req, res) => {
    console.log("nfc detection...");
    const { workshopId } = req.params;
    const { nfc, timestamp } = req.body;

    console.log(`Received NFC data for workshop ${workshopId}:`, nfc, "timestamp:", timestamp);

    try {
        if (!workshopScanningState[workshopId] || !workshopScanningState[workshopId].isScanning) {
            return res.status(403).json({ message: `NFC scanning is not allowed for workshop ${workshopId}.` });
        }

        if (nfc) {
            workshopScanningState[workshopId].currentNFC = nfc[0];
            res.status(200).json({ message: `NFC tag ${nfc} detected for workshop ${workshopId} and accepted.` });
        } else {
            res.status(400).json({ message: "No NFC tag provided." });
        }
    } catch (error) {
        console.error(`Failed to handle NFC scanning for workshop ${workshopId}:`, error);
        res.status(500).json({ message: "Failed to handle NFC scanning." });
    }
});

// Get the current NFC state for a specific workshop
app.get("/nfc/:workshopId", async (req, res) => {
    const { workshopId } = req.params;

    try {
        const state = workshopScanningState[workshopId];
        console.log("state", state);

        if (!state || !state.isScanning) {
            console.log("error");
            return res.status(403).json({ message: `NFC scanning is not allowed for workshop ${workshopId}.` });
        }

        if (!state.currentNFC) {
            return res.status(204).json({ message: `NFC tag not scanned yet for workshop ${workshopId}. Wait a few seconds and try again.` });
        }

        const artisan = await prisma.artisan.findFirst({ where: { nfcId: state.currentNFC } });
        if (!artisan) {
            return res.status(404).json({ message: `Artisan not found for NFC tag ${state.currentNFC}.` });
        }

        res.json({
            workshopId,
            artisan: artisan.name,
            nfcId: state.currentNFC,
        });
    } catch (error) {
        console.error(`Failed to handle NFC scanning for workshop ${workshopId}:`, error);
        res.status(500).json({ message: "Failed to handle NFC scanning." });
    }
});
//***************ROUTINES***************

setInterval(() => checkForAnomalies(prisma), 5000);
setInterval(() => updateStats(prisma), 5000);


//***************SERVER***************
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
