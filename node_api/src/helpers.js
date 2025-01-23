// Helper functions

/**
 * @function getLastEventTimestamp
 * @description Returns the timestamp of the last event for the given order id
 * @param {number} orderId - The id of the order
 * @returns {number} The timestamp of the last event
 */
export async function getLastEventTimestamp(orderId,prisma) {
    const lastEvent = await prisma.event.findMany({
      where: {
        orderId: orderId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
    return lastEvent[0].timestamp;
  }
  /**
   * @function calculateMinutesDifference
   * @description Returns the time difference between the current timestamp and a given timestamp in minutes
   * @param {number} lastEventTimestamp - The timestamp from which to calculate the difference
   * @returns {number} The time difference in minutes
   */
export async function calculateMinutesDifference(lastEventTimestamp) {
    const now = new Date();
    const diffTime = Math.abs(now - lastEventTimestamp);
    const res = Math.ceil(diffTime / (1000 * 60));
    return res;
  }
  

  /**
   * @function timestampToBestUnit
   * @description Converts a timestamp to a string representing the time difference in minutes or hours
   * @param {number} timestamp - The timestamp to convert
   * @returns {string} The time difference in minutes or hours
   */
export function timestampToBestUnit(timestamp) {
    const diffTime = timestamp
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      return `${diffHours} hours`;
    }
  }