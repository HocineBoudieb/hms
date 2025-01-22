//****************************************************************
//STATS MANAGEMENT
//****************************************************************
//function to convert timestamp difference to hour or minutes depending on the difference
  
  
  
  /**
   * Updates the average time in encours and workshops in the stats table
   * by querying the time table and calculating the difference from the current value
   * in the stats table.
   */
  async function update_Stats(){
  
    //Update Average time in encours, by getting total times in time table where enCoursId is not null
    const aggregate_time_in_encours = await prisma.time.aggregate({
      _sum: {
        duration: true,
      },
      where: {
        enCoursId: {
          not: null,
        },
      },
    });
    const total_time_in_encours = aggregate_time_in_encours._sum.duration;
    //get the current value in stats table
    const current_total_time_in_encours = await prisma.stats.findUnique({
      where: {
        id: 6,
      },
    });
    const current_total_time_in_encours_value = parseInt(current_total_time_in_encours.value, 10);
    //calculate the difference in percentage
    let value_unit = timestampToBestUnit(total_time_in_encours); //"X hours"
    //check if current stat value is different from the new value
    if(current_total_time_in_encours.value !== parseInt)
    {
      const difference_encours = current_total_time_in_encours_value === 0 ? 0 : (parseInt(value_unit, 10) - current_total_time_in_encours_value) / current_total_time_in_encours_value * 100;
      //update the stat table
      await prisma.stats.update({
        where: {
          id: 6,
        },
        data: {
          value: parseInt(value_unit, 10),
          change: Math.abs(difference_encours),
          unit: value_unit.split(" ")[1],
          isUp: difference_encours < 0 ? false : true,
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
  
  