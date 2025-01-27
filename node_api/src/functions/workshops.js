import { getLastEventTimestamp, calculateMinutesDifference } from "../helpers.js";

export const getWorkshops = (prisma) => async (req, res) => {
  try {
    const workshops = await prisma.workshop.findMany({
      include: {
        EnCours: {
          include: {
            Antenna: true,
          },
        },
        Order: true,
      },
      orderBy: {
        EnCours: {
          Antenna: {
            reference: "asc",
          },
        },
      },
    });
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workshops." });
  }
};

export const getWorkshopById = (prisma) => async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await prisma.workshop.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        EnCours: true,
        Order: true,
      },
    })
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch workshop." });
  }
};

export const getOrdersByWorkshopId = (prisma) => async (req, res) => {
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
    res.json(ordersWithDurationSinceLastEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
};

export const createWorkshop = (prisma) => async (req, res) => {
  try {
    const { name, startDate, endDate, EnCoursId } = req.body;
    const workshop = await prisma.workshop.create({
      data: {
        name,
        startDate,
        endDate,
        EnCoursId,
      },
    });
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ error: "Failed to create workshop." });
  }
};

