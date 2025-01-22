//File: gets/encours.js

/**
 * Configures and sets up API endpoints for retrieving and managing antennas and EnCours data.
 * 
 * This module exports a function that accepts a Prisma client as a parameter and defines several
 * HTTP GET routes using the provided Express app instance. The routes retrieve data related to
 * antennas, EnCours, and associated orders, based on the Prisma client queries.
 * 
 * Routes:
 * - GET /antennas: Fetches all antennas from the database.
 * - GET /encours: Retrieves all EnCours records, including associated Antenna and Order data.
 * - GET /encours/:id: Fetches a specific EnCours record by ID, including related Antenna and Rfid data.
 * - GET /encours/:id/orders: Retrieves all orders associated with a specific EnCours ID, including details
 *   such as RfidOrder, Alert, Support, and calculates the duration since the last event.
 * 
 * @param {Object} prisma - The Prisma client used for database operations.
 */

module.exports = (prisma) => {
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
};

