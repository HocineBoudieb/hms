// File: src/gets/workshops.js

/**
 * Configures and sets up API endpoints for retrieving and managing workshops and associated orders.
 *
 * This module exports a function that accepts a Prisma client as a parameter and defines several
 * HTTP GET routes using the provided Express app instance. The routes retrieve data related to
 * workshops, orders, and associated EnCours, RfidOrder, Alert, and Support records, based on the
 * @param {Object} prisma - The Prisma client used for database operations.
 *
 * Routes:
 * - GET /workshops: Fetches all workshops from the database, including associated EnCours and orders.
 * - GET /workshops/:id: Fetches a specific workshop by ID, including associated EnCours records.
 * - GET /workshops/:id/orders: Retrieves all orders associated with a specific workshop ID, including
 *   details such as RfidOrder, Alert, Support, and calculates the duration since the last event.
 */
export default (prisma) => {
  app.get("/workshops", async (req, res) => {
    try {
      const workshops = await prisma.workshop.findMany({
        include: {
          EnCours: true,
          Order: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workshops." });
    }
  });
  
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
};
