
export const getAllProducts = (prisma) => async (req, res) => {
    try {
        const products = await prisma.product.findMany(
            {
                include: {
                    Order: true,
                },
            }
        );
        
        const productsWithMeanTime = await Promise.all(
            //for each products map into orders
            products.map(async (product) => {
                let meanTime = 0;
                let count = 0;
                product.Order.map(async (order) => {
                    if (!order || order?.status !== 2) return;
                    meanTime += (order.endDate - order.startDate);
                    count++;
                });
                meanTime = meanTime ? meanTime / count : 0;
                return {
                    ...product,
                    averagePrdDuration: meanTime,
                };
            })
        );
        res.json(productsWithMeanTime);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products." });
    }
}

export const getProductById = (prisma) => async (req, res) => {
    //fetch all orders with this product id
    try {  
        const { id } = req.params;
        const orders = await prisma.order.findMany({
            where: {
                productId: parseInt(id),
            },
            include: {
                Alert: true,
                Support: true,
            },
        });
        const ordersWithTraversalTime = await Promise.all(
            orders.map(async (order) => {
                let traversalTime;
                if (order.status !== 2) traversalTime = 0;
                else traversalTime = order.endDate - order.startDate;
                const orderWithTraversalTime = {
                    ...order,
                    traversalTime,
                };
                return orderWithTraversalTime;
            })
        );
        res.json(ordersWithTraversalTime);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
}