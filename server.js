import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.ts";

const app = express();
const port = `${process.env.EXPRESS_PORT}`;


app.listen(port, () => {
    console.log(`App is runnig on Port: ${port}`);
});