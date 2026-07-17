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

// UPDATE ORDER STATUS BY ADMIN
export async function updateOrderStatusByAdmin(orderId, status) {
    return prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
}

// FIND ORDER
export async function findOrder(id) {
    return prisma.order.findUnique({
        where: { id }
    });
}