# SpeakBuddy — MVP

## Goal

SpeakBuddy helps users practice English through structured 1-to-1 conversations and group discussions with other users.

---

## MVP Features

### 1. Authentication
- User registration
- User login
- JWT-based authentication
- Protected routes

### 2. User Profile
- Basic user information
- English proficiency level
- Interests

### 3. 1-to-1 Conversations
- Match two users
- Assign a predefined conversation topic to both users
- Start/end a conversation session
- Voice call
- Video call
- Real-time text chat

### 4. Group Discussions
- Create a discussion room
- Join a discussion room
- Predefined discussion topic
- Multiple participants
- Voice/video communication
- Real-time text chat
- Start/end a discussion session

### 5. Session History
- View previous 1-to-1 conversations
- View previous group discussions
- Store basic session information and participants

---

## MVP Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Real-time communication: Socket.IO
- Authentication: JWT
- Deployment: AWS

---

## Out of Scope for MVP

- Google Authentication
- AI conversation evaluation
- AI-generated topics
- AI interviewer
- Payments
- Advanced matching/recommendations
- Advanced analytics

---

## Core User Flow

Register → Login → Profile → Match → Get Topic → Voice/Video + Chat → End Session → History

Group Flow:

Create/Join GD → Get Topic → Group Voice/Video + Chat → End Session → History