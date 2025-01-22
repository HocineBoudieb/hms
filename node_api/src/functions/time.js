/**
 * Retrieves all time entries from the database, including associated Order, EnCours, and Workshop
 * records.
 *
 * @param {Object} prisma - The Prisma client used for database operations.
 *
 * @returns {Promise<void>}
 */
export const getAllTimeEntries = (prisma) => async (req, res) => {
  try {
    const timeEntries = await prisma.time.findMany({
      include: {
        Order: true,
        EnCours: true,
        Workshop: true,
      },
    });
    res.json(timeEntries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time entries." });
  }
};
