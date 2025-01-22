export const getAllEvents = (prisma) => async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        Order: true,
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
};
