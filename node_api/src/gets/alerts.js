//get alerts
app.get("/alerts",async (req,res) => {
    try{
        const alerts = await prisma.alert.findMany();
        res.json(alerts);
    }catch (error) {
        res.status(500).json({error: "Failed to fetch alerts"});
    }
  });
  
  //get active alerts
  app.get("/alerts/active",async (req,res) => {
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
  });