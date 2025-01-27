import { getLastEventTimestamp, calculateMinutesDifference } from "../helpers.js";


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
    const encours = await prisma.enCours.findUnique({
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
    const ordersWithDurationSinceLastEvent = await Promise.all(
      orders.map(async (order) => {
        const lastEventTimestamp = await getLastEventTimestamp(order.id,prisma);
        const minutesDifference = await calculateMinutesDifference(lastEventTimestamp);
        return {
          ...order,
          daysSinceCreation: minutesDifference,
        };
      })
    );
    const ordersWithTrolley = await Promise.all(
      ordersWithDurationSinceLastEvent.map(async (order) => {
        if(order.rfidOrderId === null) return order;
        const rfid = await prisma.rfid.findUnique({
          where: {
            rfidOrderId: order.rfidOrderId,
          }
        });
        return {
          ...order,
          trolley: rfid.trolley,
        };
      })
    );
    res.json(ordersWithTrolley);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};
