export const getOrders = async (req, res) => {
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
};

export const createOrder = async (req, res) => {
  try {
    const { rfidId, startDate, endDate, status, enCoursId, workshopId } = req.body;
    const rfid = await prisma.rfid.findFirst({
      where: { reference: rfidId },
    });
    const idrfid = rfid.id;
    const rfidorder = await prisma.rfidOrder.create({
      data: { status: 1 },
    });

    const order = await prisma.order.create({
      data: {
        status: 1,
        startDate: new Date(startDate),
        endDate: null,
        enCoursId: 22,
        workshopId: null,
        rfidOrderId: rfidorder.id,
      },
    });

    await prisma.rfid.update({
      where: { id: idrfid },
      data: { rfidOrderId: rfidorder.id },
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
};

app.get("/orders", getOrders);
app.post("/orders", createOrder);
