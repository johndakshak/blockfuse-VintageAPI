import { prisma } from "../lib/prisma";

//   id        Int      @id @default(autoincrement())
//   quantity  Int
//   userId    Int
//   productId Int
//   user      User     @relation(fields: [userId], references: [id])
//   product   Product  @relation(fields: [productId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt

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