/**
 * Retrieves all Antennas from the database and sends them in the response.
 *
 * @param {Response} res - The Express response object.
 * @throws {Error} If fetching antennas fails.
 */
export const getAntennas = async (res) => {
  try {
    const antennas = await prisma.antenna.findMany();
    res.json(antennas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch antennas." });
  }
};


