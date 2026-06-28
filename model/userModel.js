import { prisma } from "../lib/prisma";
import bcrypt, { genSalt } from "bcrypt";

export async function createNewUser(data) {

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword
        }
    });
}

export async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id) {
    return prisma.user.findUnique({ where: { id } });
}

export async function findAllUsers() {
    return prisma.user.findMany();
}