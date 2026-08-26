import express from "express";
import "dotenv/config";
import cors from "cors";
import { prisma } from "./lib/prisma.ts";
import userRoutes from "./routes/userRoutes.js";
import loginRoutes from "./routes/loginRoute.js";
import currentUserRoute from "./routes/currentUserRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";
import checkoutRoute from "./routes/checkoutRoute.js";
import orderRoute from "./routes/orderRoute.js";
import paymentRoute from "./routes/paymentRoute.js";
import webhookRoute from "./routes/webhookRoute.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

const app = express();
const port = `${process.env.EXPRESS_PORT}`;

// ─── CORS ─────────────────────────────────────────────────────────────────────
//
// The browser blocks cross-origin requests unless the server explicitly says
// which origins are allowed.  Without this the frontend gets:
//   TypeError: Failed to fetch
//
// Only the two legitimate frontend origins are whitelisted:
//   • http://localhost:3000            — local Next.js dev server
//   • https://blockfuse-vintage.vercel.app — production frontend on Vercel
//
// No trailing slashes — browsers send the origin without one.

const allowedOrigins = [
  "http://localhost:3000",
  "https://blockfuse-vintage.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no Origin header (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Any other origin is blocked — logged so you can see it in the server console
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  // Authorization is required for protected routes (GET /me, GET /cartItems, etc.)
  allowedHeaders: ["Content-Type", "Authorization"],

  // credentials: true is NOT set.
  // The frontend authenticates with Authorization: Bearer <token>, not cookies,
  // so enabling credentials mode here would be unnecessary.
};

// Apply CORS to every incoming request
app.use(cors(corsOptions));

// Respond to OPTIONS preflight requests for every route.
// The browser sends OPTIONS before POST /login, GET /me, etc.
// Using the same corsOptions object means there is only one place to update origins.
// Express 5 uses path-to-regexp v8 which no longer accepts bare "*".
// "{*path}" is the correct Express 5 wildcard syntax for "match any path".
app.options("{*path}", cors(corsOptions));

// ─── Body parsing & rate limiting ─────────────────────────────────────────────

app.use(express.json());
app.use(generalLimiter);
app.use("/users", userRoutes);
app.use("/", loginRoutes);
app.use("/", currentUserRoute);
app.use("/", productRoute);
app.use("/", cartRoute);
app.use("/", checkoutRoute);
app.use("/", orderRoute);
app.use("/", paymentRoute);
app.use("/", webhookRoute);

// Swagger UI — interactive docs at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Raw OpenAPI JSON spec at /openapi.json
app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

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
