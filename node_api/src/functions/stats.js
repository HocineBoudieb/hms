export const getAllStats = (prisma) => async (req, res) => {
  try {
    const stats = await prisma.stats.findMany();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

