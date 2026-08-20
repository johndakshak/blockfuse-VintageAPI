/**
 * @openapi
 * /product:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a new product (admin only)
 *     description: >
 *       Creates a new product listing. Requires authentication and the `ADMIN` role.
 *
 *       The request must be sent as `multipart/form-data` because the product image
 *       is uploaded directly to **Cloudinary** via multer. The resulting Cloudinary
 *       URL is stored as `imageUrl` — do **not** send a raw `imageUrl` string in the body;
 *       send the binary file in the `image` field instead.
 *
 *       Images are stored in the `blockfuseVintage/products` Cloudinary folder and
 *       transformed to a maximum of 800×800 px on upload.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Vintage Denim Jacket
 *               description:
 *                 type: string
 *                 example: Classic 90s denim jacket in excellent condition
 *               price:
 *                 type: number
 *                 example: 4500
 *               stock:
 *                 type: integer
 *                 example: 5
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image file (jpg, jpeg, png, or webp)
 *     responses:
 *       201:
 *         description: Product added successfully
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
 *                   example: Product added successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or missing image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 *             examples:
 *               missingImage:
 *                 summary: No image uploaded
 *                 value:
 *                   success: false
 *                   msg: "Product image is required"
 *               invalidName:
 *                 summary: Name too short
 *                 value:
 *                   success: false
 *                   msg: "Name must be at least 2 characters long"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products (public)
 *     description: Returns the full product catalogue. No authentication required.
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: Products retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 *
 * /product/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a single product by ID (public)
 *     description: Returns a single product record. No authentication required.
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *                   example: Product retrived successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid or non-numeric ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponseWithReason'
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update a product (admin only)
 *     description: >
 *       Partially updates a product. All fields are optional.
 *       If a new `image` file is uploaded, the Cloudinary URL is replaced;
 *       otherwise the existing `imageUrl` is preserved.
 *
 *       Send request as `multipart/form-data`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Updated Jacket Name
 *               description:
 *                 type: string
 *                 example: Updated description
 *               price:
 *                 type: number
 *                 example: 5000
 *               stock:
 *                 type: integer
 *                 example: 10
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Replacement image file (optional; jpg, jpeg, png, or webp)
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: Product updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product (admin only)
 *     description: Permanently removes a product from the catalogue.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               msg: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
