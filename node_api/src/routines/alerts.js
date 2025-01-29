//****************************************************************
//ALERTS MANAGEMENT
//****************************************************************


/**
 * Create an alert for a given order and type, if it doesn't already exist.
 * @param {number} orderId The order ID.
 * @param {number} type The type of the alert.
 */
async function createAlert(orderId, type,prisma) {
    //if alert already exists for this order with the same type, do nothing
    const existingAlert = await prisma.alert.findFirst({
      where: {
        orderId: orderId,
        type: type,
        status: 1,
      },
    });
    if (existingAlert) {
      return;
    }
    console.log("Creating Alert");
    await prisma.alert.create({
      data: {
        orderId: orderId,
        type: type,
        status: 1,
        startDate: new Date(),
      },
    });
    console.log("Alert Created");
  }
  
  /**
   * Resolve an alert by setting its status to 0 and its end date to the current
   * timestamp.
   * @param {number} alertId The ID of the alert to resolve.
   */
async function resolveAlert(alertId,prisma) {
    await prisma.alert.update({
      where: {
        id: alertId,
      },
      data: {
        status: 0,
        endDate: new Date(),
      },
    });
  }
  
  /**
   * Check for anomalies in the orders and create alerts if necessary.
   * Anomalies are defined as:
   * - An order is in an encours and in a workshop
   * - An order is not in an encours and not in a workshop for more than 10 seconds
   * Also, check if the anomalies are resolved and close the corresponding alerts
   */
export async function checkForAnomalies(prisma) {
    //Check if an active order is in an encours and in a workshop
    const orders = await prisma.order.findMany(
      {
        where: {
          status: 1,
        }
      });
    const ordersWithTwoLocationsAnomalies = orders.filter(order => order.enCoursId && order.workshopId);
  
    //Check if an order is not in an encours and not in a workshop for more than 10 seconds
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    const ordersWithoutLocation = orders.filter(order => !order.enCoursId && !order.workshopId);
    const ordersWithoutLocationAnomalies = [];
    //check if these orders last event is more than 10 seconds ago
    for (const order of ordersWithoutLocation) {
      const events = await prisma.event.findMany({
        where: {
          orderId: order.id,
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
      const lastEvent = events[0];
      const lastEvent_timestamp = new Date(lastEvent.timestamp);
      //console.log("last event timestamp", lastEvent_timestamp);
  
      if (lastEvent_timestamp < tenSecondsAgo) {
        ordersWithoutLocationAnomalies.push(order);
      }
    }
    //Create alerts for the anomalies
    for(const order of ordersWithTwoLocationsAnomalies){
      createAlert(order.id, 1,prisma);
    }
    for(const order of ordersWithoutLocationAnomalies){
      createAlert(order.id, 2,prisma);
    }
  
    //Check if Anomalies are resolved
    const alerts = await prisma.alert.findMany({
      where: {
        status: 1,
      },
    });
    const resolvedAlerts = [];
    for(const alert of alerts){
      const order = await prisma.order.findUnique({
        where: {
          id: alert.orderId,
        },
      });
      //check type of alert
      if(alert.type === 1){
        //check if order is in an encours or in a workshop but not in both (exclusive or)
        if((order.enCoursId && !order.workshopId) || (!order.enCoursId && order.workshopId)){
          resolvedAlerts.push(alert.id);
        }
      }
      else{
        //check if order is in an encours or in a workshop
        if(order.enCoursId || order.workshopId){
          resolvedAlerts.push(alert.id);
        }
      }
    }
    for(const alertId of resolvedAlerts){
      resolveAlert(alertId,prisma);
    }
  
  }
  
  