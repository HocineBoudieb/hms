export const getEnCours = (prisma) => async (req, res) => {
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
};

export const getEnCoursById = (prisma) => async (req, res) => {
  try {
    const { id } = req.params;
    const encours = await prisma.enCours.findMany({
      where: {
        id: parseInt(id),
      },
      include: {
        Antenna: true,
        Order: true,
      },
    });
    res.json(encours);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to fetch EnCours." });
  }
};

export const getOrdersByEnCoursId = (prisma) => async (req, res) => {
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
    console.log("orders", orders);
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
};
