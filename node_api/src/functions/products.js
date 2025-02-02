
export const getAllProducts = (prisma) => async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
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
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
}