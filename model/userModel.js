import { prisma } from "../lib/prisma";

export async function createNewUser(data) {
    return prisma.user.create({data});
}

export async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}