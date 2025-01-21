// File: src/gets/workshops.js
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