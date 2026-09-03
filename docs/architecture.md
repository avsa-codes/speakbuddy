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