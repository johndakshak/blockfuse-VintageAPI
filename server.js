import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/userRoutes.js"

const app = express();
const port = `${process.env.EXPRESS_PORT}`;

app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true, 
        msg: "Welcome to Blockfuse Vintage"})
});


app.listen(port, () => {
    console.log(`App is runnig on Port: ${port}`);
});