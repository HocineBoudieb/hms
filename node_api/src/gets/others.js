// Get all Artisans with total working hours
app.get("/artisans", async (req, res) => {
    try {
      const artisans = await prisma.artisan.findMany({
        include: {
          Support: true,
        },
      });
      const artisansWithStats = artisans.map(artisan => {
        const totalWorkingHours = artisan.Support.reduce((sum, support) => {
          const hours = Math.abs(new Date(support.endDate) - new Date(support.startDate)) / (1000 * 60 * 60);
          return sum + hours;
        }, 0);
        return {
          ...artisan,
          totalWorkingHours,
        };
      });
      res.json(artisansWithStats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artisans." });
    }
  });
  
  // Get all Events
  app.get("/events", async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        include: {
          Order: true,
        },
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events." });
    }
  });
  // Get all Rfids
app.get("/rfids", async (req, res) => {
  try {
    const rfids = await prisma.rfid.findMany({
      include: {
        RfidOrder: true,
      },
    });
    res.json(rfids);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rfids." });
  }
});

app.get("/supports", async (req, res) => {
  try {
    const supports = await prisma.support.findMany({
      include: {
        Artisan: true,
        Order: true
      },
    });
    res.json(supports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supports." });
  }
});
//Get all stats
app.get("/stats", async (req, res) => {
  try {
    const stats = await prisma.stats.findMany();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});


//Get all time
app.get("/time", async (req, res) => {
  try {
    const time = await prisma.time.findMany();
    res.json(time);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time." });
  }
});