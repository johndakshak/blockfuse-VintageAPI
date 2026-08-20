/**
 * @openapi
 * /payment/{id}:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Initialise Paystack payment for an order
 *     description: >
 *       Calls the Paystack Transactions API to initialise a payment for the specified
 *       order. The `id` is the **order ID** (not a payment ID).
 *
 *       Requirements:
 *       - The order must belong to the authenticated user
 *       - The order status must be `PENDING`
 *
 *       On success, Paystack returns an `authorization_url` that the client should
 *       redirect the user to in order to complete payment. The payment `reference` is
 *       stored on the order (`paymentReference`).
 *
 *       After payment completes on Paystack's side, the `POST /webhook/paystack`
 *       endpoint updates the order status to `PROCESSING` automatically.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Order ID to pay for
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       description: No request body required — all data is derived from the authenticated user and the order record.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment initialised — redirect user to `authorization_url`
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
 *                   example: Payment initialized successfully
 *                 data:
 *                   $ref: '#/components/schemas/PaystackInitData'
 *       400:
 *         description: Invalid order ID or Paystack API error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Order does not belong to the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               msg: "Order does not belong to this user"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Order is not in PENDING status (already paid / cancelled / etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               msg: "Cannot make payment. Order is already PROCESSING"
 *
 * /webhook/paystack:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Paystack webhook — verify payment and update order status
 *     description: >
 *       Receives signed event payloads from **Paystack**. This endpoint is intended
 *       to be called by Paystack only, not by client applications.
 *
 *       **Signature verification:** The request `x-paystack-signature` header is
 *       validated using HMAC-SHA512 with the `PAYSTACK_SECRET_KEY`. Requests with
 *       an invalid or missing signature receive `401`.
 *
 *       On a `charge.success` event, the order identified by `data.reference` is
 *       advanced from `PENDING` → `PROCESSING`.
 *     parameters:
 *       - in: header
 *         name: x-paystack-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: >
 *           HMAC-SHA512 signature of the raw request body, computed with
 *           `PAYSTACK_SECRET_KEY`. Paystack includes this header automatically.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Paystack event payload
 *             properties:
 *               event:
 *                 type: string
 *                 example: "charge.success"
 *               data:
 *                 type: object
 *                 properties:
 *                   reference:
 *                     type: string
 *                     example: "paystack_ref_abc123"
 *     responses:
 *       200:
 *         description: Event processed (or acknowledged if not `charge.success`)
 *       401:
 *         description: Invalid or missing Paystack signature
 *       400:
 *         description: Processing error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 */
