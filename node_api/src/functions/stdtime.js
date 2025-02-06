export const getStdTimes = (prisma) => async (req, res) => {
    try {
      const stats = await prisma.stdTime.findMany({
        include: {
          Workshop: true,
        },
      });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stdtimes." });
    }
  };
  
  