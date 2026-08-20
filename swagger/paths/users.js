/**
 * @openapi
 * /users/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account. The password is hashed with bcrypt before
 *       storage — plain-text passwords are never persisted.
 *
 *       **Password requirements:** minimum 8 characters, at least one uppercase
 *       letter, one lowercase letter, one number, and one symbol.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Alice Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: >
 *                   Must contain at least one uppercase letter, one lowercase letter,
 *                   one number, and one symbol (e.g. `!@#$%^&*()`).
 *                 example: "StrongPass1!"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Alice Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: alice@example.com
 *       400:
 *         description: Missing or invalid input (name, email, or password validation failure)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPassword:
 *                 summary: Weak password
 *                 value:
 *                   success: false
 *                   msg: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol"
 *               invalidEmail:
 *                 summary: Bad email format
 *                 value:
 *                   success: false
 *                   msg: "Invalid email format"
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               msg: "Email already exists"
 *
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (admin only)
 *     description: >
 *       Returns a list of all registered users.
 *       Requires authentication **and** the `ADMIN` role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID (authenticated)
 *     description: Returns id, name, and email for the specified user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     responses:
 *       200:
 *         description: User found
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
 *                 data:
 *                   $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: Invalid or non-numeric ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /users/update/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user (partial update, authenticated)
 *     description: >
 *       Supports partial updates — only `name` and/or `email` may be updated.
 *       Fields omitted from the request body are left unchanged.
 *       Requires authentication; users can update themselves (no admin restriction enforced server-side beyond auth).
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Alice Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice.smith@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         description: Email already in use by a different user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               msg: "Email already exist"
 *
 * /users/delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user (authenticated)
 *     description: Permanently deletes the specified user record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdInPath'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               msg: User deleted successfully
 *       400:
 *         description: Invalid or non-numeric ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
