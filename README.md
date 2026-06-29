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
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
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