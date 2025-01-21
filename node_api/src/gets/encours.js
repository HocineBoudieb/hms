//File: gets/encours.js
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
  