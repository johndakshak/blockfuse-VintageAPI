import { prisma } from "../lib/prisma";

// ADD NEW PRODUCT
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

export async function findAllProducts() {
    return prisma.product.findMany();
}

export async function findProductById(id) {
    return prisma.product.findUnique({ where: { id } });
}

export async function updateProductDetails(id, data) {
    return prisma.product.update({
        where: { id },
        data
    });
}

export async function deleteProductById(id) {
    return prisma.product.delete({ where: { id } });
}