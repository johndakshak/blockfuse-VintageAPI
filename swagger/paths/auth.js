/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in and receive a JWT access token
 *     description: >
 *       Validates credentials and returns a signed JWT.
 *       The token expires in **30 minutes** and must be sent as
 *       `Authorization: Bearer <token>` on all protected routes.
 *       This endpoint is rate-limited to **5 requests per 15 minutes** per IP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "MyPass1!"
 *     responses:
 *       200:
 *         description: Login successful — JWT returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: login successfull
 *                 access_token:
 *                   type: string
 *                   description: "Signed JWT. Use as: Authorization: Bearer <access_token>"
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Empty or invalid email/password format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Invalid email or password (user not found or wrong password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               msg: "Ivalid email or password"
 *
 * /me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the currently authenticated user
 *     description: >
 *       Returns the full user record of the caller identified by the JWT.
 *       Requires a valid Bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: User found
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
