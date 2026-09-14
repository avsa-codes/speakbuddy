# SpeakBuddy — Architecture

## Architecture Style

Decoupled full-stack application.

- Frontend and backend are separate applications.
- Frontend communicates with backend through REST APIs.
- Socket.IO is used for real-time communication.
- Backend handles business logic and database access.

---

## System Overview

React Frontend
      │
      ├── REST API ──────────┐
      │                      │
      └── Socket.IO ──────────┤
                             ▼
                    Node.js + Express
                             │
                    ┌────────┴────────┐
                    │                 │
                 Prisma          Socket.IO
                    │                 │
                    ▼                 │
                PostgreSQL            │
                                      │
                              Real-time events

---

## Frontend

**React + TypeScript**

Responsible for:
- UI and pages
- User interactions
- API communication
- Authentication state
- Socket.IO client
- Voice/video interface

---

## Backend

**Node.js + Express + TypeScript**

Responsible for:
- REST APIs
- Authentication and authorization
- Business logic
- Input validation
- Database operations
- Socket.IO server
- Session and matching logic

---

## Database

**PostgreSQL + Prisma**

Stores:
- Users
- Profiles
- Matches
- Conversation sessions
- Messages
- Group discussion rooms
- Participants
- Session history

---

## Communication

### REST API

Used for:
- Registration/login
- User profiles
- Matching
- Session management
- Group rooms
- History
- Other request/response operations

### Socket.IO

Used for:
- Real-time messaging
- Room communication
- Match/session events
- Participant presence
- Real-time voice/video signalling

WebRTC will handle the actual peer-to-peer audio/video connection.

---

## Authentication

- Email/password authentication
- Passwords securely hashed
- JWT used for authentication
- Protected backend routes require valid authentication

Google authentication is outside the MVP.

---

## Main Data Flow

### 1-to-1 Conversation

User → Match → Topic → Session → Voice/Video + Chat → End Session → History

### Group Discussion

Create/Join Room → Topic → Participants → Voice/Video + Chat → End Session → History

## AI & Safety Layer

SpeakBuddy will extend its real-time architecture with **AI-powered conversation fallback, content moderation, user reporting, and onboarding analysis**.

### AI Conversation Fallback

When no suitable human partner is available, SpeakBuddy will provide an AI conversation partner for real-time English practice.

**Technologies:**
- **Gemini Live API** — real-time AI voice conversation.
- **WebSocket** — bidirectional streaming communication with the Gemini Live API.
- **Browser Media APIs** — microphone/audio capture and playback.
- **React + TypeScript** — AI conversation interface and session controls.
- **Backend (Node.js + Express)** — AI session management, authentication, usage/rate controls, and secure API integration where required.

```text
User
  ↓
React + Browser Audio APIs
  ↓
WebSocket
  ↓
Gemini Live API
  ↓
Streaming AI Audio Response
  ↓
User


One important architectural distinction is captured here:

**Human ↔ Human:** `Socket.IO + WebRTC`

**User ↔ AI:** `WebSocket + Gemini Live API`

That distinction is important enough that I would definitely keep it in the architecture document.



## Important Commands 

npm install -D eslint @eslint/js typescript-eslint prettier eslint-config-prettier

eslint → code-quality/linting engine
@eslint/js → recommended JavaScript rules
typescript-eslint → makes ESLint understand TypeScript
prettier → automatic code formatting
eslint-config-prettier → prevents ESLint and Prettier rules from fighting each other

npm install -D --save-exact prettier

## Prisma Commands 

npm install @prisma/client
npm install -D prisma
npx prisma init 
npx prisma orm init --yes --target postgres --authoring psl
npx prisma orm init --yes --target postgres --authoring psl --confirm backend
npx prisma contract emit

## Prisma URL Structure 
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE


## Prisma Seeding 


npm run db:seed

## Prisma Check Constraints 


npx prisma contract emit
npx prisma migration plan --name initial-schema
npx prisma migration new --name update-user-fields
 npx prisma migration new --name add_database_check_constraints
node "migrations/app/20260907T1721_update_user_fields/migration.ts"
npx prisma migration status
npx prisma db migrate


Add the constraints 

node migrations/app/20260905T0836_initial_schema/migration.ts
npx prisma migration show migrations/app/20260905T0836_initial_schema



constraints: [
  primaryKey(['id']),
  checkExpression(
    'rating_value_check',
    '"rating" >= 1 AND "rating" <= 5',
  ),
],


Prisma 8 — Database Change Workflow
🟢 First time: Creating the initial database

When you're building the schema from scratch:

1. Make the changes in

src/prisma/contract.prisma

2. Emit the contract

npx prisma contract emit

This updates:

contract.json
contract.d.ts

3. Create the migration

npx prisma migration plan --name initial-schema

This creates:

migrations/app/<timestamp>_initial_schema/

4. If you need custom migration-level changes, edit:

migration.ts

For example, we added our CHECK constraints there.

5. Regenerate the migration operations

node migrations/app/<timestamp>_initial_schema/migration.ts

This regenerates:

ops.json
migration.json

6. Review the migration

npx prisma migration show migrations/app/<timestamp>_initial_schema

Check the DDL preview carefully.

7. Apply it

npx prisma db migrate

8. Verify

npx prisma migration status

You want:

✔ Up to date
🔵 Every future database change

This is the part you'll use most often.

Suppose you already have:

20260905_initial_schema

and later decide:

"I want to add phoneNumber to User."

Step 1 — Change the contract

Edit:

src/prisma/contract.prisma

Add the new field.

Step 2 — Emit the updated contract
npx prisma contract emit
Step 3 — Create a NEW migration
npx prisma migration plan --name add-phone-number

This creates something like:

migrations/app/
├── 20260905T0836_initial_schema/
└── 20260906T1015_add_phone_number/

Do NOT modify the already-applied initial_schema migration.

Step 4 — Review the new migration
npx prisma migration show migrations/app/<new-migration>
Step 5 — Apply it
npx prisma db migrate
Step 6 — Verify
npx prisma migration status

You want:

✔ Up to date