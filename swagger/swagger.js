import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Blockfuse Vintage API",
      version: "1.0.0",
      description:
        "Backend REST API for **Blockfuse Vintage** — a vintage e-commerce platform. " +
        "Supports user management, product catalogue, cart, checkout, order tracking, and Paystack payment processing.",
      contact: {
        name: "Blockfuse Vintage",
        url: "https://blockfusevintage.onrender.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "https://blockfusevintage.onrender.com",
        description: "Production",
      },
      {
        url: "http://localhost:5000",
        description: "Local development",
      },
    ],

    // ------------------------------------------------------------------ //
    // Security scheme — JWT Bearer token (issued by POST /login)           //
    // ------------------------------------------------------------------ //
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT access token obtained from `POST /login`. " +
            "Pass it as `Authorization: Bearer <token>`. Tokens expire in 30 minutes.",
        },
      },

      // ---------------------------------------------------------------- //
      // Reusable schemas (derived from Prisma schema + controller logic)  //
      // ---------------------------------------------------------------- //
      schemas: {
        // ---------- enums ----------
        Role: {
          type: "string",
          enum: ["USER", "ADMIN"],
          example: "USER",
        },
        OrderStatus: {
          type: "string",
          enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
          example: "PENDING",
        },

        // ---------- User ----------
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alice Doe" },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            role: { $ref: "#/components/schemas/Role" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-06-27T20:00:00.000Z",
            },
          },
        },

        UserPublic: {
          type: "object",
          description: "Public-facing user data (no password)",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alice Doe" },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
          },
        },

        // ---------- Product ----------
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 10 },
            name: { type: "string", example: "Vintage Denim Jacket" },
            description: {
              type: "string",
              nullable: true,
              example: "Classic 90s denim jacket in excellent condition",
            },
            price: {
              type: "number",
              format: "decimal",
              example: 4500.0,
            },
            imageUrl: {
              type: "string",
              format: "uri",
              example:
                "https://res.cloudinary.com/blockfuse/image/upload/v1/blockfuseVintage/products/jacket.jpg",
            },
            stock: { type: "integer", example: 5 },
            createdBy: { type: "integer", example: 1 },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T16:08:12.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-05T16:08:12.000Z",
            },
          },
        },

        // ---------- Cart ----------
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 3 },
            quantity: { type: "integer", example: 2 },
            userId: { type: "integer", example: 1 },
            productId: { type: "integer", example: 10 },
            product: { $ref: "#/components/schemas/Product" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-13T21:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-13T21:00:00.000Z",
            },
          },
        },

        // ---------- OrderItem ----------
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 5 },
            orderId: { type: "integer", example: 2 },
            productId: { type: "integer", example: 10 },
            quantity: { type: "integer", example: 2 },
            price: {
              type: "number",
              format: "decimal",
              example: 4500.0,
            },
            product: { $ref: "#/components/schemas/Product" },
          },
        },

        // ---------- Order ----------
        Order: {
          type: "object",
          properties: {
            id: { type: "integer", example: 2 },
            userId: { type: "integer", example: 1 },
            totalPrice: {
              type: "number",
              format: "decimal",
              example: 9000.0,
            },
            status: { $ref: "#/components/schemas/OrderStatus" },
            paymentReference: {
              type: "string",
              nullable: true,
              example: "paystack_ref_abc123",
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-17T18:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-07-17T18:00:00.000Z",
            },
          },
        },

        // ---------- Paystack init response ----------
        PaystackInitData: {
          type: "object",
          properties: {
            authorization_url: {
              type: "string",
              format: "uri",
              example: "https://checkout.paystack.com/abc123",
            },
            access_code: {
              type: "string",
              example: "abc123",
            },
            reference: {
              type: "string",
              example: "paystack_ref_abc123",
            },
          },
        },

        // ---------- Shared success/error wrappers ----------
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            msg: { type: "string", example: "Operation successful" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            msg: { type: "string", example: "Error message" },
          },
        },
        ErrorResponseWithReason: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            msg: { type: "string", example: "Error message" },
            reason: { type: "string", example: "Detailed reason" },
          },
        },
        UnauthorizedResponse: {
          type: "object",
          properties: {
            status: { type: "boolean", example: false },
            msg: {
              type: "string",
              example: "Access denied. No token provided",
            },
          },
        },
        ForbiddenResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            msg: { type: "string", example: "Access denied. Admins only" },
          },
        },
      },

      // ---------------------------------------------------------------- //
      // Reusable responses                                                //
      // ---------------------------------------------------------------- //
      responses: {
        Unauthorized: {
          description: "Missing or invalid JWT token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UnauthorizedResponse" },
            },
          },
        },
        Forbidden: {
          description: "Valid token but insufficient permissions (admin only)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ForbiddenResponse" },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        BadRequest: {
          description: "Validation error or invalid input",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },

      // ---------------------------------------------------------------- //
      // Reusable parameters                                               //
      // ---------------------------------------------------------------- //
      parameters: {
        IdInPath: {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Numeric resource ID",
          example: 1,
        },
      },
    },

    tags: [
      { name: "Auth", description: "Authentication — login and current user" },
      { name: "Users", description: "User CRUD (admin: list all, view any)" },
      { name: "Products", description: "Product catalogue management" },
      { name: "Cart", description: "Shopping cart operations (authenticated users)" },
      {
        name: "Checkout",
        description:
          "Converts cart into an order with atomic stock reservation",
      },
      {
        name: "Orders",
        description: "Order retrieval and status management",
      },
      {
        name: "Payments",
        description: "Paystack payment initialisation and webhook verification",
      },
    ],

    // All routes under paths are documented inline via JSDoc in the route files
  },

  // Tell swagger-jsdoc where to scan for @openapi / @swagger JSDoc annotations
  apis: ["./routes/*.js", "./swagger/paths/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
