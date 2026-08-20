/**
 * @openapi
 * /checkout:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Convert cart to an order (atomic)
 *     description: >
 *       Converts the authenticated user's entire cart into a new **Order** in a single
 *       database transaction. The transaction:
 *
 *       1. Reads all cart items (with product prices)
 *       2. Calculates `totalPrice` server-side (never trusted from the client)
 *       3. Creates the `Order` record
 *       4. Creates one `OrderItem` per cart entry
 *       5. Decrements stock for each product (fails if any item is under-stocked)
 *       6. Clears the cart
 *
 *       The order starts with status `PENDING`. Proceed to `POST /payment/{id}` to
 *       initialise payment.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout successful — order created
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
 *                   example: Checkout successfull
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 *                     totalPrice:
 *                       type: number
 *                       example: 9000.00
 *       400:
 *         description: Cart is empty or insufficient stock for one or more products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 *             examples:
 *               emptyCart:
 *                 summary: Cart is empty
 *                 value:
 *                   success: false
 *                   msg: "Failed to checkout"
 *                   reason: "Cart is empty"
 *               insufficientStock:
 *                 summary: Not enough stock
 *                 value:
 *                   success: false
 *                   msg: "Failed to checkout"
 *                   reason: "Insufficient stock for product 10"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
