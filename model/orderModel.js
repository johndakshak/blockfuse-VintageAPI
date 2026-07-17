import { prisma } from "../lib/prisma";

// GET ALL ORDER ITEMS BY A USER
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

// GET ALL ORDERS BY ADMIN
export async function findAllOrdersByAdmin() {
    return prisma.order.findMany({
        include: { 
            items: { 
                include: { product: true } 
            } 
        }
    })
}