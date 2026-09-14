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

## 6. Additional MVP Features

### 6.1 Profile Photo

Users will be able to upload a profile photo during profile setup. The profile photo will be displayed on their profile and in relevant conversation contexts.

### 6.2 30-Second English Introduction

During profile setup, users will be asked to record a short **30-second spoken introduction**.

**Prompt:**
> Tell us a little about yourself or why you want to join SpeakBuddy. Try to speak in English in a simple and natural way.

The introduction will:

- Encourage users to make an initial effort to speak English.
- Help ensure that users joining the platform are genuine language learners.
- Provide useful information that can later support conversation matching.
- Potentially be analyzed by AI in the future for English proficiency and communication-related signals.

**The introduction will NOT be used as a pass/fail entrance test in the MVP.**

### 6.3 AI Conversation Partner

If no suitable human conversation partner is available, SpeakBuddy will provide an **AI conversation partner as a fallback** so users can continue practicing English.

The AI conversation partner will:

- Support real-time English conversation.
- Use voice-based interaction.
- Follow the user's selected topic or practice objective.
- Adapt its conversation style to the user's level where appropriate.

**Human-to-human conversation remains the core SpeakBuddy experience. AI is a fallback when a suitable human partner is unavailable.**

### 6.4 AI-Assisted Content Moderation

SpeakBuddy will use **AI-assisted moderation** to help detect harmful or inappropriate behavior during conversations.

The moderation system will aim to detect:

- Severe profanity and abusive language.
- Harassment.
- Hate speech.
- Threats.
- Sexually inappropriate behavior or content.
- Other serious violations of SpeakBuddy's Terms & Conditions.

For video conversations, SpeakBuddy will also use **real-time visual moderation** where technically feasible to detect explicit or severely inappropriate visual content.

AI moderation will be used as a safety mechanism and may trigger immediate protective actions, reporting, or administrative review.

### 6.5 User Reporting

Users will be able to report another participant during or after a conversation.

Possible report reasons include:

- Harassment or abusive behavior.
- Hate speech.
- Sexual or inappropriate behavior.
- Threats.
- Spam.
- Other violations of SpeakBuddy's Terms & Conditions.

AI moderation and user reports will work together as SpeakBuddy's initial safety system.

### 6.6 Safety Actions

Based on the severity of a violation, SpeakBuddy may:

- Warn the user.
- End the current conversation.
- Flag the user or conversation for review.
- Temporarily restrict the user's access.
- Permanently suspend or ban the user for serious or repeated violations.

The exact moderation thresholds and enforcement rules will be refined as the platform is tested.