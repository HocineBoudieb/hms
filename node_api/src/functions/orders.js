export const getAllOrders = (prisma) => async (req, res) => {
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

/**
 * @description Creates a new order and associated RFID order in the database.
 * @param {Object} prisma - The Prisma client instance for database access.
 * @param {Object} req - The request object containing order details.
 * @param {Object} res - The response object to send the result of the operation.
 * @param {String} req.body.rfidId - The RFID reference for the order.
 * @param {String} req.body.startDate - The start date of the order.
 * @param {String} req.body.endDate - The end date of the order.
 * @param {Number} req.body.status - The status of the order.
 * @param {Number} req.body.enCoursId - The EnCours ID associated with the order.
 * @param {Number} req.body.workshopId - The Workshop ID associated with the order.
 * @returns {Object} The created order object.
 */
export const createOrder = (prisma) => async (req, res) => {
  try {
    const { trolley, startDate, endDate, status, enCoursId, workshopId } = req.body;
    const rfid = await prisma.rfid.findFirst({
      where: { trolley: trolley },
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

export const getLastEventForOrder = (prisma) => async (req, res) => {
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
};
  