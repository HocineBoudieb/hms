
/**
 * Configures and sets up API endpoints for retrieving and managing orders and associated data.
 *
 * This module exports a function that accepts a Prisma client as a parameter and defines an
 * HTTP GET route using the provided Express app instance. The route retrieves all orders from
 * the database, including associated RfidOrder, Alert, and Support records, and calculates the
 * duration since the last event.
 *
 * @param {Object} prisma - The Prisma client used for database operations.
 */
export default (prisma) => {
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
};
