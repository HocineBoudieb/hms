// Get all Rfids
export const getAllRfids = async (prisma) => {
  try {
    const rfids = await prisma.rfid.findMany({
      include: {
        RfidOrder: true,
      },
    });
    return rfids;
  } catch (error) {
    throw error;
  }
};
