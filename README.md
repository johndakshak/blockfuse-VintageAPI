# Blockfuse Vintage API

Backend API for **Blockfuse Vintage**, an e-commerce platform. Built with Express.js and Prisma ORM, using PostgreSQL as the database.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js (v5)
- **Language:** TypeScript (Prisma Client layer) + JavaScript (ESM)
- **ORM:** Prisma 7 (`prisma-client` generator)
- **Database:** PostgreSQL
- **Driver Adapter:** `@prisma/adapter-pg` (via `pg`)
- **Password Hashing:** bcrypt
- **Dev Tooling:** `tsx` (run/watch TypeScript + JavaScript together), `dotenv`

## Architecture

This project follows a layered, separation-of-concerns structure:

```
blockfuse-vintageAPI/
├── prisma/
│   ├── schema.prisma       # Data models, single source of truth
│   └── migrations/         # Tracked schema change history
├── lib/
│   └── prisma.ts           # Prisma Client bridge (adapter-pg connection)
├── model/
│   └── userModel.js        # Database queries (Prisma calls)
├── controller/
│   └── userController.js   # Request/response handling, validation orchestration
├── routes/
│   └── userRoutes.js       # URL → controller mapping
├── utils/
│   └── validators.js       # Shared input validation (email, name, password)
├── server.js                # App entry point
├── prisma.config.ts         # Prisma CLI configuration (connection, migration path)
├── tsconfig.json
└── .env
```

**Request flow:** `routes` → `controller` → `model` → Prisma Client → PostgreSQL

## Why TypeScript *and* JavaScript?

Prisma 7's default generator (`prisma-client`) emits TypeScript-only output. Rather than convert the entire project, this API uses a hybrid setup:

- `lib/prisma.ts` and Prisma's generated client stay TypeScript, since that's required by the generator.
- All application code (`server.js`, `routes/`, `controller/`, `model/`, `utils/`) stays plain JavaScript using ES Modules (`import`/`export`), run via `tsx` so both file types execute seamlessly in the same process.

## Getting Started

### Prerequisites

- Node.js (v22+)
- PostgreSQL installed and running locally

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>"
EXPRESS_PORT=5000
```

### Database Setup

Run the initial migration to create your tables:

```bash
npx prisma migrate dev
```

Generate the Prisma Client (runs automatically with `migrate dev`, but can be run standalone):

```bash
npx prisma generate
```

### Running the Server

```bash
npm run dev
```

Server starts on `http://localhost:5000` (or your configured `EXPRESS_PORT`).

## API Reference

### Users

| Method | Endpoint              | Description                  |
|--------|------------------------|-------------------------------|
| GET    | `/users`               | Get all users                |
| POST   | `/users/create`        | Create a new user            |
| GET    | `/users/:id`           | Get a single user by ID      |
| PATCH  | `/users/update/:id`    | Update a user (partial)      |
| DELETE | `/users/delete/:id`    | Delete a user                |

#### `POST /users/create`

Request body:
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "StrongPass1!"
}
```

Password requirements: minimum 8 characters, must include at least one uppercase letter, one lowercase letter, one number, and one symbol.

Responses:
- `201` — user created
- `400` — missing/invalid input
- `409` — email already exists

#### `PATCH /users/update/:id`

Supports partial updates — only fields included in the request body are validated and updated. Omitted fields are left unchanged.

Responses:
- `200` — updated successfully
- `400` — invalid ID or invalid field data
- `404` — user not found
- `409` — email already in use by another user

#### `DELETE /users/delete/:id`

Responses:
- `200` — deleted successfully
- `400` — invalid ID
- `404` — user not found

## Data Model

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role      @default(USER)
  createdAt DateTime @default(now())
}
```

Passwords are hashed with bcrypt before being persisted — plain-text passwords are never stored.

## Roadmap

- [ ] Product model and routes
- [ ] Order and OrderItem models
- [ ] Cart functionality
- [ ] Authentication (login route, session/token handling)
- [ ] Deployment (Render + Supabase PostgreSQL)

## License

ISC (Internet Systems Consortium license)


Cloudinary Onboarding Prompt

Here are my Cloudinary credentials:
Cloud Name: givotqdz
API Key: 144413426326642
API Secret: <INSERT_API_SECRET>

You are helping a first-time Cloudinary user who already has an account set up their integration from scratch. Follow these rules:

1. Start by asking: "What programming language are you using?" Wait for the answer before proceeding.

2. Follow the steps below in order - complete each step fully before moving to the next.

3. Wait for user responses - When you ask a question, stop and wait for their answer. Do not proceed until you get a response.

4. Execute commands - When there is a command to run, show it and run it immediately after showing it.

5. Recover first, then stop if needed (strict) - On command failure: retry once, then try one corrected variant once. If still failing, STOP and wait for user confirmation. Do not continue and do not assume success.

6. Manual-run handoff (strict) - If you cannot run a command, ask the user to run exactly one command, then STOP and wait for confirmation. Full output is optional.

7. No progress without confirmation - After a failure or manual-run handoff, do not proceed until the user provides explicit confirmation.

8. One question at a time - If you need to ask something, ask only one question and wait.

9. Step-by-step explanation - Do not explain the whole plan upfront. Explain each step briefly as you work through it, without meta disclaimers.

10. Actual results only (strict) - Never provide expected, sample, or hypothetical command output when a step requires execution results. Only report real output produced by commands that were actually run (by the agent or by the user during manual handoff). If real output is unavailable and the user confirms to continue, continue without fabricating output.

11. Instruction priority and compliance check (strict) - The rules in this first section are mandatory for every later step. Priority order is: user message > step-specific rule > global rule. Before writing any analysis, verify you followed execution instructions and have real command output when required. If not, go back, execute, and collect output first.

12. Do not open transformed URLs (strict) - The transformed image URL is for the user to open manually. Never open or navigate to it.

STEP 1 — Install the Cloudinary SDK

Show the exact install command for the user's language and run it. Do not explain the package manager in detail. Mention the command and execute it. If install fails, STOP and wait for user confirmation before doing anything else.

STEP 2 — Credentials

The user will need three values from Cloudinary:
- Cloud name
- API key
- API secret

Tell the user to get these from: https://console.cloudinary.com/app/settings/api-keys

Ask the user to provide these three values and store them for use in the script. Do not move to the next step until you have collected all three credential values from the user.

STEP 3 — Write the script

Create a single script file in the user's chosen language that does all of the following in sequence:

1. Configure Cloudinary — Use an inline configuration block (no separate .env file). For this onboarding flow, inline credentials in the script are required. Use the real credential values collected in Step 2 by default. Use placeholder values only if the user does not want to provide credentials:
   - Cloud name: YOUR_CLOUD_NAME
   - API key: YOUR_API_KEY
   - API secret: YOUR_API_SECRET

2. Upload an image — Upload a sample image URL from Cloudinary's demo domains (use images from res.cloudinary.com/demo/). Print the secure URL and public ID of the uploaded image to the console.

3. Get image details — After uploading, fetch and print the following metadata about the uploaded image: width, height, format, and file size in bytes.

4. Transform the image — Generate a transformed version of the image URL using both f_auto (automatic format selection) and q_auto (automatic quality). Briefly explain in a code comment what each transformation does. Print a final success message to the console, e.g. "Done! Click link below to see optimized version of the image. Check the size and the format." Print the transformed URL for the user to open.

STEP 4 — Make the script executable

Show the chmod command to make the script executable and run it. Then run the script itself. If either command fails or cannot be run by the agent, ask the user to run that one command and STOP and wait for user confirmation before continuing.

STEP 5 — Review the results

After the script runs, show the complete actual output and provide commentary on what happened. Explain what each part of that real output means and confirm that the Cloudinary integration is working correctly. Point out the key information like the uploaded image URL, the metadata, and the transformed image link. Ask the user to check transformed-image size/format by opening the transformed URL.

If the script was not executed successfully, do not provide a "what you can expect" section and do not fabricate output. Briefly state what is missing and strongly suggest the user paste the script output for a detailed explanation.

For this step, follow this exact gate:
1. Verify whether script output is available in this session.
2. If output is available, explain results and tie the explanation to the actual output shown.
3. If output is unavailable, finish Step 5 without blocking and strongly suggest the user paste output for detailed explanation.
4. The transformed-image size/format check is a user follow-up after opening the transformed URL.

FORMATTING RULES FOR THE SCRIPT:

- The entire flow must be in one file.
- If placeholders are used, clearly mark the three placeholder values (YOUR_CLOUD_NAME, YOUR_API_KEY, YOUR_API_SECRET) with a comment like "← replace this" so the user can find them instantly.
- The script must work by running it directly — no extra setup steps required beyond installing the SDK and filling in the credentials.
- Do not use a separate .env file or any environment variable exports outside the script.