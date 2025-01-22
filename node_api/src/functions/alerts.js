// Get all Alerts
export const getAllAlerts = async (prisma) => {
  try {
    const alerts = await prisma.alert.findMany();
    return alerts;
  } catch (error) {
    throw error;
  }
};

// Get active Alerts
export const getActiveAlerts = async (prisma) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: {
        status: 1,
      },
    });
    return alerts;
  } catch (error) {
    throw error;
  }
};
