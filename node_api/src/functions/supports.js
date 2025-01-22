// Get all Supports
export const getAllSupports = async (prisma) => {
  try {
    const supports = await prisma.support.findMany({
      include: {
        Artisan: true,
        Order: true,
      },
    });
    return supports;
  } catch (error) {
    throw error;
  }
};

// Create a new Support
export const createSupport = async (prisma, data) => {
  try {
    const support = await prisma.support.create({
      data: {
        ...data,
        startDate: new Date(),
        endDate: null,
      },
    });
    return support;
  } catch (error) {
    throw error;
  }
};
