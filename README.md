# SpeakBuddy

> A real-time language exchange platform for practicing spoken English through meaningful 1-to-1 conversations.

SpeakBuddy connects users with conversation partners based on **topic, English proficiency, and shared interests**.

The project is being built as a full-stack application with a focus on **real-time communication, matchmaking, backend architecture, and production-oriented engineering practices**.

> 🚧 **Status:** Actively under development. Core authentication, profiles, matchmaking, and real-time 1-to-1 conversations are currently implemented. Group discussions and WebRTC are planned next.

---

## ✨ Features

### 🔐 Authentication & Profiles

- User registration and login
- JWT-based authentication
- Protected API routes
- User profiles
- English proficiency levels
- User interests
- Profile photo uploads using AWS S3

### 🤝 Preference-Based Matchmaking

Users are matched based on:

- Conversation topic
- English proficiency
- Shared interests

The matchmaking system uses a scoring algorithm to prioritize compatible users.

| Criteria | Score |
|---|---:|
| Same proficiency level | +3 |
| 1 level apart | +2 |
| 2 levels apart | +1 |
| 3+ levels apart | +0 |
| Each shared interest | +1 |

`BEGINNER ↔ PROFICIENT` is treated as an incompatible combination.

Topic matching is a **hard requirement**, while interests act as a preference.

### ⚡ Real-Time Communication

SpeakBuddy uses **Socket.IO** for real-time communication.

Current implementation includes:

- Authenticated socket connections
- User-specific socket rooms
- Matchmaking events
- Conversation rooms
- Real-time 1-to-1 messaging
- Conversation lifecycle events
- Conversation duration tracking
- Partner conversation-end notifications

Messages are currently delivered in real time without database persistence.

### 💬 1-to-1 Conversations

Once two users are matched:

1. A conversation is created in PostgreSQL.
2. Both users join a dedicated Socket.IO room.
3. Both clients receive the conversation ID.
4. Users can exchange messages in real time.
5. Either participant can end the conversation.
6. The conversation is marked as completed and its duration is stored.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │  React + TypeScript  │
                    └──────────┬──────────┘
                               │
                     HTTP / Socket.IO
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │  Node.js + TypeScript│
                    └───────┬─────┬───────┘
                            │     │
                     Prisma │     │ Socket.IO
                            │     │
                            ▼     ▼
                    ┌──────────┐  ┌──────────────┐
                    │PostgreSQL│  │ Real-Time    │
                    │ Database │  │ Communication│
                    └──────────┘  └──────────────┘
                            │
                            ▼
                       ┌─────────┐
                       │ AWS S3  │
                       │ Photos  │
                       └─────────┘
