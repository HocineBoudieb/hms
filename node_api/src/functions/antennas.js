const getAntennas = async (res) => {
  try {
    const antennas = await prisma.antenna.findMany();
    res.json(antennas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch antennas." });
  }
};
