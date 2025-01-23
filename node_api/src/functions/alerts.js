/**
 * Retrieves all alerts from the database.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
export const getAllAlerts = (prisma) => async (req, res) => {
    try{
        const alerts = await prisma.alert.findMany();
        res.json(alerts);
    }catch (error) {
        res.status(500).json({error: "Failed to fetch alerts"});
    }
  };
  

/**
 * Retrieves all active alerts from the database.
 * @param {Object} prisma - The Prisma client used for database operations.
 * @returns {Promise<void>}
 */
  export const getActiveAlerts = (prisma) => async (req, res) => {
    try{
        const alerts = await prisma.alert.findMany({
          where: {
            status: 1
          }
        });
        res.json(alerts);
    }catch (error) {
        res.status(500).json({error: "Failed to fetch alerts"});
    }
  };
