import { prisma } from "../lib/prisma";


export async function createNewProduct(data) {

    return prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            price: data.price,
            imageUrl: data.imageUrl,
            stock: data.stock,
            user: {
                connect: { id: data.createdBy } 
            }
        }
    });
}

export async function getAllProducts() {
    return prisma.product.findMany();
}