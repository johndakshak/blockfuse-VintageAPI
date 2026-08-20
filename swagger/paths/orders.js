/**
 * @openapi
 * /order:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get orders for the authenticated user
 *     description: >
 *       Returns all orders that belong to the authenticated user,
 *       including nested `items` with their associated product details.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *                   example: Order retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders (admin only)
 *     description: >
 *       Returns every order in the system with all nested items and products.
 *       Requires authentication **and** the `ADMIN` role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *                   example: Orders retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /order/status/{id}:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update order status (admin only)
 *     description: >
 *       Advances an order through its lifecycle. Only valid **transitions** are
 *       permitted — invalid transitions return `409`.
 *
 *       | From → | Allowed next statuses |
 *       |---|---|
 *       | `PENDING` | `PROCESSING`, `CANCELLED` |
 *       | `PROCESSING` | `SHIPPED`, `CANCELLED` |
 *       | `SHIPPED` | `DELIVERED` |
 *       | `DELIVERED` | *(terminal)* |
 *       | `CANCELLED` | *(terminal)* |
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/OrderStatus'
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: "Status updated to SHIPPED"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid or non-numeric order ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         description: Invalid status value or disallowed transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidStatus:
 *                 summary: Unrecognised status
 *                 value:
 *                   success: false
 *                   msg: "Please provide a valid status"
 *               alreadySet:
 *                 summary: Order already has that status
 *                 value:
 *                   success: false
 *                   msg: "Order is already PROCESSING"
 *               illegalTransition:
 *                 summary: Transition not allowed
 *                 value:
 *                   success: false
 *                   msg: "Cannot change status from SHIPPED to PENDING"
 */
