/**
 * Retrieves all Antennas from the database and sends them in the response.
 *
 * @param {Response} res - The Express response object.
 * @throws {Error} If fetching antennas fails.
 */
export const getAntennas = (prisma) => async (req, res) => {
  try {
    const antennas = await prisma.antenna.findMany();
    res.json(antennas);
  } catch (error) {
    console.log("Failed to fetch antennas:", error);
    res.status(500).json({ error: "Failed to fetch antennas." });
  }
};


export const antennasMac = {
  0: "2c:cf:67:ae:12:45",
  1: "2ccf67ae1240",
  2: "2ccf67ae1241",
  3: "2c:cf:67:ae:12:42",
  4: "2c:cf:67:ae:12:43",
}