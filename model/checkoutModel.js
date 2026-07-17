import { prisma } from "../lib/prisma";

export async function checkoutItems(data) {

    if (!data?.userId) {
        throw new Error("userId is required to checkout");
    }

    return prisma.$transaction(async (tx) => {

        // 1. get cart items
        const cartItems = await tx.cart.findMany({
            where: { userId: data.userId },
            include: { product: true }
        });

        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // 2. calculate total price server-side from actual product prices
        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + Number(item.product.price) * item.quantity
        }, 0);

        // 3. create order
        const order = await tx.order.create({
            data: {
                userId: data.userId,
                totalPrice
            }
        });

        // 4. create orderItems
        await tx.orderItem.createMany({
            data: cartItems.map(item => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            }))
        });

        // 5. decrement stock per item, guarding against insufficient stock
        for (const item of cartItems) {
            const result = await tx.product.updateMany({
                where: {
                    id: item.productId,
                    stock: { gte: item.quantity }
                },
                data: {
                    stock: { decrement: item.quantity }
                }
            });

            if (result.count === 0) {
                throw new Error(`Insufficient stock for product ${item.productId}`);
            }
        }

        // 6. clear cart
        await tx.cart.deleteMany({
            where: { userId: data.userId }
        });

        return { order, cartItems, totalPrice };
    });
}