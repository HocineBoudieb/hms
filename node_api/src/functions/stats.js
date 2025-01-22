export const getAllStats = async (prisma) => {
  try {
    const stats = await prisma.stats.findMany();
    return stats;
  } catch (error) {
    throw error;
  }
};
