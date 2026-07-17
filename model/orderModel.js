import { prisma } from "../lib/prisma";

// GET ALL ORDER ITEMS
export async function findOrderByUserId(userId) {
    return prisma.order.findMany({
        where: { userId },
        include: { 
            items: {
                include: {
                    product: true
                } 
            } 
        }
    });
}