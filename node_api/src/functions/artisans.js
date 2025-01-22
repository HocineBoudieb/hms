const getArtisansWithStats = async (res) => {
  try {
    const artisans = await prisma.artisan.findMany({
      include: {
        Support: true,
      },
    });
    const artisansWithStats = artisans.map(artisan => {
      const totalWorkingHours = artisan.Support.reduce((sum, support) => {
        const hours = Math.abs(new Date(support.endDate) - new Date(support.startDate)) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      return {
        ...artisan,
        totalWorkingHours,
      };
    });
    res.json(artisansWithStats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artisans." });
  }
};
