import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/userRoutes.js"

const app = express();
const port = `${process.env.EXPRESS_PORT}`;

app.use(express.json());
app.use("/user", userRoutes)


app.listen(port, () => {
    console.log(`App is runnig on Port: ${port}`);
});