import { prisma } from "../lib/prisma";

// ADD PRODUCTS TO CART
export async function addProductsToCart(data) {
    return prisma.cart.upsert({
        where: { 
            userId_productId: {
                userId: data.userId,
                productId: data.productId
            }
         },
        create: { 
            quantity: data.quantity, 
            productId: data.productId,
            userId: data.userId 
        },
        update: { 
            quantity: { increment: data.quantity }
        }
    });
}

// GET ALL CART ITEMS
export async function getCartItems(userId) {
    return prisma.cart.findMany({
        where: { userId },
        include: { product: true }
    });
}