import { getLastEventTimestamp, calculateMinutesDifference } from "../helpers.js";


/**
 * Retrieves all orders from the database, including associated RfidOrder, Alert, and Support records,
 * and calculates the duration since the last event for each order.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
export const getAllOrders = (prisma) => async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        RfidOrder: true,
        Product: true,
        Alert: true,
        Support: {
          orderBy: {
            startDate: 'desc',
          }
        },
      },
    });
    const ordersWithDurationSinceLastEvent = await Promise.all(
      orders.map(async (order) => {
        if(order.status === 0) return order;
        const lastEventTimestamp = await getLastEventTimestamp(order.id,prisma);
        const Difference = new Date() - lastEventTimestamp;
        return {
          ...order,
          daysSinceCreation: Difference,
        };
      })
    );
    //add trolley data
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
    const { productId } = req.body;
    const order = await prisma.order.create({
      data: {
        startDate: new Date(),
        productId: productId,
        status: 0,
      },
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
};

/**
 * @description Fetches the last event for a specified order by order ID.
 * @param {Object} prisma - The Prisma client instance for database access.
 * @param {Object} req - The request object containing the order ID in params.
 * @param {Object} res - The response object to send the result of the operation.
 * @returns {Object} The last event object for the given order.
 */

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
  
/**
 * @description Assign an order to a given RFID.
 * @param {Number} req.body.orderId - The order ID to assign to the RFID.
 * @param {String} req.body.trolley - The trolley number associated with the RFID.
 * @returns {Object} The updated order object.
 */
export const assignOrderToRfid = (prisma) => async (req, res) => {
  try {
    const { selectedOrder, selectedTrolleyId} = req.body;
    const rfidId = selectedTrolleyId;
    const orderId = selectedOrder;
    console.log("Assigning order", orderId, "to RFID", rfidId);
    const rfid = await prisma.rfid.findFirst({
      where: {
        id: parseInt(rfidId),
      }
    });
    const rfidorderId = await prisma.rfidOrder.create({
      data: {
        status: 1, // 1 for "active"
      },
    })
    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        rfidOrderId: rfidorderId.id
      },
    });

    await prisma.rfid.update({
      where: { id: rfid.id },
      data: { rfidOrderId: order.rfidOrderId },
    });
    
    res.status(200).json(order);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to assign order to RFID." });
  }
};

/**
 * @description Creates a sample order with default values.
 * @param {Object} prisma - The Prisma client instance for database access.
 * @returns {Object} The created sample order object.
 */
export const createSampleOrder = (prisma) => async (req, res) => {
  try {
    console.log("Entered createSampleOrder");
    const { productId } = req.body;
    const sampleOrderData = {
      startDate: new Date(),
      endDate: null,
      status: 0, // Default status
      enCoursId: null,
      workshopId: null,
      productId: productId,
    };

    const order = await prisma.order.create({
      data: sampleOrderData,
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create sample order." });
  }
};

