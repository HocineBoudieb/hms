

export const  getAllActivities = (prisma) => async (req, res) => {
    try {
        const activities = await prisma.activity.findMany(
            {
                include: {
                    Support: true,
                },
            }
        );
        const activitiesWithAverageHandlingTime = activities.map(activity => {
            const supports = activity.Support;
            if (!supports) {
                return activity;
            }
            const totalDuration = supports.reduce((sum, support) => {
                return support.endDate ? sum + (new Date(support.endDate) - new Date(support.startDate)) : sum;
            }, 0);
            const averageHandlingTime = totalDuration / supports.length;
            return {
                ...activity,
                averageHandlingTime: averageHandlingTime,
            };
        });
        res.json(activitiesWithAverageHandlingTime);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activities." });
    }
};

export const getActivityById = (prisma) => async (req, res) => {
    try {
        const { id } = req.params;
        const supports = await prisma.support.findMany({
            where: {
                activityId: parseInt(id),
                endDate:{
                    not: null
                }
            },
            include: {
                Artisan: true,
                Order: true,
            },
        });
        const orders = await Promise.all(
            supports.map(async (support) => {
                const order = await prisma.order.findUnique({
                    where: {
                        id: support.orderId,
                    },
                });
                const traversalTime = support.endDate - support.startDate;
                const orderWithTraversalTime = {
                    ...order,
                    traversalTime,
                    artisan: support.Artisan.name,
                };
                return orderWithTraversalTime;
            })
        );
        res.json(orders);
        
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch activity." });
        
    }
};