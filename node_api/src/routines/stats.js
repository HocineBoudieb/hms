//import helpers
//****************************************************************
//STATS MANAGEMENT
//****************************************************************
//function to convert timestamp difference to hour or minutes depending on the difference
  
  export async function updateStats(prisma){
    //Nombre d'OF finis
    const finished_orders = await prisma.order.count({
      where: {
        status: 2,
      },
    });
    //update stat
    const current_finished_orders = await prisma.stats.findUnique({
      where: {
        id: 1,
      },
    });
    const current_finished_orders_value = parseInt(current_finished_orders.value, 10);
    if(current_finished_orders_value !== finished_orders){
      //calculate the difference
      const difference = finished_orders - current_finished_orders_value;
      await prisma.stats.update({
        where: {
          id: 1,
        },
        data: {
          value: finished_orders,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
    /***************************************************************/
    //Nombre d'OF en cours
    const en_cours_orders = await prisma.order.count({
      where: {
        enCoursId: {
          not: null
        }
      },
    });
    //update stat
    const current_en_cours_orders = await prisma.stats.findUnique({
      where: {
        id: 2,
      },
    });
    const current_en_cours_orders_value = parseInt(current_en_cours_orders.value, 10);
    if(current_en_cours_orders_value !== en_cours_orders){
      //calculate the difference
      const difference = en_cours_orders - current_en_cours_orders_value;
      await prisma.stats.update({
        where: {
          id: 2,
        },
        data: {
          value: en_cours_orders,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
    /***************************************************************/
    //Nombre d'OFen workshop
    const en_workshop_orders = await prisma.order.count({
      where: {
        workshopId: {
          not: null
        }
      },
    });
    //update stat
    const current_en_workshop_orders = await prisma.stats.findUnique({
      where: {
        id: 3,
      },
    });
    const current_en_workshop_orders_value = parseInt(current_en_workshop_orders.value, 10);
    if(current_en_workshop_orders_value !== en_workshop_orders){
      //calculate the difference
      const difference = en_workshop_orders - current_en_workshop_orders_value;
      await prisma.stats.update({
        where: {
          id: 3,
        },
        data: {
          value: en_workshop_orders,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
    /***************************************************************/
    //Nombre d'alertes actives
    const active_alerts = await prisma.alert.count({
      where: {
        status: 1,
      },
    });
    //update stat
    const current_active_alerts = await prisma.stats.findUnique({
      where: {
        id: 4,
      },
    });
    const current_active_alerts_value = parseInt(current_active_alerts.value, 10);
    if(current_active_alerts_value !== active_alerts){
      //calculate the difference
      const difference = active_alerts - current_active_alerts_value;
      await prisma.stats.update({
        where: {
          id: 4,
        },
        data: {
          value: active_alerts,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    } 
    /***************************************************************/
    //Nombre d'OF inactifs
    const inactive_orders = await prisma.order.count({
      where: {
        status: 0,
      },
    });
    //update stat
    const current_inactive_orders = await prisma.stats.findUnique({
      where: {
        id: 5,
      },
    });
    const current_inactive_orders_value = parseInt(current_inactive_orders.value, 10);
    if(current_inactive_orders_value !== inactive_orders){
      //calculate the difference
      const difference = inactive_orders - current_inactive_orders_value;
      await prisma.stats.update({
        where: {
          id: 5,
        },
        data: {
          value: inactive_orders,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
    /***************************************************************/
    //Nombre de chariots disponibles rfid with no rfidorderid
    const available_rfid = await prisma.rfid.count({
      where: {
        rfidOrderId: null,
      },
    });
    //update stat
    const current_available_rfid = await prisma.stats.findUnique({
      where: {
        id: 6,
      },
    });
    const current_available_rfid_value = parseInt(current_available_rfid.value, 10);
    if(current_available_rfid_value !== available_rfid){
      //calculate the difference
      const difference = available_rfid - current_available_rfid_value;
      await prisma.stats.update({
        where: {
          id: 6,
        },
        data: {
          value: available_rfid,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
    /***************************************************************/
    //Nombre d'artisans
    const artisans = await prisma.artisan.count();
    //update stat
    const current_artisans = await prisma.stats.findUnique({
      where: {
        id: 7,
      },
    });
    const current_artisans_value = parseInt(current_artisans.value, 10);
    if(current_artisans_value !== artisans){
      //calculate the difference
      const difference = artisans - current_artisans_value;
      await prisma.stats.update({
        where: {
          id: 7,
        },
        data: {
          value: artisans,
          change: Math.abs(difference),
          isUp: difference > 0,
          lastTime: new Date(),
        },
      });
    }
  }
  
  