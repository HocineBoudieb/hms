//****************************************************************
//STATS MANAGEMENT
//****************************************************************
//function to convert timestamp difference to hour or minutes depending on the difference
  
  async function calculate_time_in_encours(antennaRef){
    //get encours with antenna which has reference antennaRef
    const encours = await prisma.encours.findUnique({
      where: {
        antenna: {
          reference: antennaRef
        }
      }
    });
    //aggregate time in this encours
    const aggregate_time_in_encours = await prisma.time.aggregate({
      _sum: {
        duration: true,
      },
      where: {
        enCoursId: encours.id
      },
    });
    const total_time_in_encours = aggregate_time_in_encours._sum.duration;
    return total_time_in_encours
  }
  
  /**
   * Updates the average time in encours and workshops in the stats table
   * by querying the time table and calculating the difference from the current value
   * in the stats table.
   */
  async function update_Stats(){
  
    //Update Average time in encours, by getting total times in time table where enCoursId is not null
    
    const total_time_in_encours1 = await calculate_time_in_encours(1);
    const total_time_in_encours2 = await calculate_time_in_encours(2);
    const total_time_in_encours3 = await calculate_time_in_encours(3);
    //get the current value in stats table
    const current_total_time_in_encours1 = await prisma.stats.findUnique({
      where: {
        id: 6,
      },
    });
    const current_total_time_in_encours2 = await prisma.stats.findUnique({
      where: {
        id: 7,
      },
    });
    const current_total_time_in_encours3 = await prisma.stats.findUnique({
      where: {
        id: 8,
      },
    });
    const current_total_time_in_encours_value1 = parseInt(current_total_time_in_encours1.value, 10);
    const current_total_time_in_encours_value2 = parseInt(current_total_time_in_encours2.value, 10);
    const current_total_time_in_encours_value3 = parseInt(current_total_time_in_encours3.value, 10);
    //calculate the difference in percentage
    let value_unit1 = timestampToBestUnit(total_time_in_encours1); //"X hours"
    let value_unit2 = timestampToBestUnit(total_time_in_encours2); //"X hours"
    let value_unit3 = timestampToBestUnit(total_time_in_encours3); //"X hours"
    //check if current stat value is different from the new value
    if(current_total_time_in_encours_value1 !== parseInt(value_unit1, 10))
    {
      const difference_encours1 = current_total_time_in_encours_value1 === 0 ? 0 : (parseInt(value_unit1, 10) - current_total_time_in_encours_value1) / current_total_time_in_encours_value1 * 100;
      //update the stat table
      await prisma.stats.update({
        where: {
          id: 6,
        },
        data: {
          value: parseInt(value_unit1, 10),
          change: Math.abs(difference_encours1),
          unit: value_unit1.split(" ")[1],
          isUp: difference_encours1 < 0 ? false : true,
          lastTime: new Date(),
        },
      });
    }
    if(current_total_time_in_encours_value2 !== parseInt(value_unit2, 10))
    {
      const difference_encours2 = current_total_time_in_encours_value2 === 0 ? 0 : (parseInt(value_unit2, 10) - current_total_time_in_encours_value2) / current_total_time_in_encours_value2 * 100;
      //update the stat table
      await prisma.stats.update({
        where: {
          id: 7,
        },
        data: {
          value: parseInt(value_unit2, 10),
          change: Math.abs(difference_encours2),
          unit: value_unit2.split(" ")[1],
          isUp: difference_encours2 < 0 ? false : true,
          lastTime: new Date(),
        },
      });
    } 
    if(current_total_time_in_encours_value3 !== parseInt(value_unit3, 10))
    {
      const difference_encours3 = current_total_time_in_encours_value3 === 0 ? 0 : (parseInt(value_unit3, 10) - current_total_time_in_encours_value3) / current_total_time_in_encours_value3 * 100;
      //update the stat table
      await prisma.stats.update({
        where: {
          id: 8,
        },
        data: {
          value: parseInt(value_unit3, 10),
          change: Math.abs(difference_encours3),
          unit: value_unit3.split(" ")[1],
          isUp: difference_encours3 < 0 ? false : true,
          lastTime: new Date(),
        },
      });
    }
  
  
    //Update Average time in workshop, by getting total times in time table where workshopId is not null
    const aggregate_time_in_workshop = await prisma.time.aggregate({
      _sum: {
        duration: true,
      },
      where: {
        workshopId: {
          not: null,
        },
      },
    });
    const total_time_in_workshop = aggregate_time_in_workshop._sum.duration;
    //get the current value in stats table
    const current_total_time_in_workshop = await prisma.stats.findUnique({
      where: {
        id: 1,
      },
    });
    
    const current_total_time_in_workshop_value = parseInt(current_total_time_in_workshop.value, 10);
    value_unit = timestampToBestUnit(total_time_in_workshop);
  
    if(current_total_time_in_workshop.value !== parseInt(value_unit, 10))
    { 
      //calculate the difference in percentage
      const difference_workshop = current_total_time_in_workshop_value === 0 ? 0 : Math.abs(((parseInt(timestampToBestUnit(total_time_in_workshop), 10) - current_total_time_in_workshop_value) / current_total_time_in_workshop_value) * 100);
      
      //update the stat table
      await prisma.stats.update({
        where: {
          id: 1,
        },
        data: {
          value: parseInt(value_unit, 10),
          change: difference_workshop,
          unit: value_unit.split(' ')[1]
        },
      });
    }
  }
  
  