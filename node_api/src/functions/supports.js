
/**
 * Retrieves all support records from the database, including associated
 * Artisan and Order records.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
export const getAllSupports = (prisma) => async (req, res) => {
  try {
    const supports = await prisma.support.findMany({
      include: {
        Artisan: true,
        Order: true,
      },
    });
    res.json(supports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supports." });
  }
};

  /**
   * @description Create a support in the database and assign it to an order.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {String} rfidId - The RFID reference.
   * @param {String} type - The type of the support.
   * @param {String} artisan - The artisan NFC ID.
   * @returns {Object} The created support.
   */
export const createSupport = (prisma) => async (req, res) => {
  try {
    //format: rfidId type artisanNfc
    const { orderId, type, artisan } = req.body;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    //get order last localization from last event
    const event = await prisma.event.findMany({
      where: {
        orderId: order.id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    const lastEvent = event[0];
    const enCoursId = lastEvent.enCoursId;//change by get last event

    const Workshop = await prisma.workshop.findFirst({
      where: {
        enCoursId: enCoursId,
      },
    });
    //Assign workshop to order
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        workshopId: Workshop.id,
      },
    });
    await prisma.rfid.update({
      where: {
        id: rfid.id,
      },
      data: {
        workshopId: Workshop.id,
      }
    })
    //Get artisan from artisan nfc
    const artisan_instance = await prisma.artisan.findFirst({
      where: {
        nfcId: artisan,
      },
    });
    const support = await prisma.support.create({
      data: {
        orderId: order.id,
        artisanId: artisan_instance.id,
        workshopId: Workshop.id,
        type: parseInt(type.split(" ")[1]),
        startDate: new Date(),
        endDate: null,
      },
    });
    res.json(support);
  } catch (error) {
    res.status(500).json({ error: "Failed to create support." });
  }
};

