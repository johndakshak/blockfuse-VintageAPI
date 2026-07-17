import express from "express";
import "dotenv/config";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/userRoutes.js";
import loginRoutes from "./routes/loginRoute.js";
import currentUserRoute from "./routes/currentUserRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import checkoutRoute from "./routes/checkoutRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

const app = express();
const port = `${process.env.EXPRESS_PORT}`;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/", loginRoutes);
app.use("/", currentUserRoute);
app.use("/", productRoute);
app.use("/", cartRoute);
app.use("/", checkoutRoute);
app.use("/", orderRoute);
app.use("/", paymentRoute);

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true, 
        msg: "Welcome to Blockfuse Vintage"
    });
});

app.use((err, req, res, next) => {
    console.error("Global error handler:", err);
    res.status(500).json({ success: false, msg: "Internal server error", reason: err.message });
});


app.listen(port, () => {
    console.log(`BlockfuseVintage is runnig on Port: ${port}`);
});