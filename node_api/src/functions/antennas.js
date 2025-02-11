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
  0: "2ccf67c45dcd",
  1: "2ccf67ae1241",
  2: "2ccf67ae1041",
  3: "2ccf67c3ea11",
  4: "2ccf67c3e980",
}