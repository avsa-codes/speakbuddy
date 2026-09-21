# SpeakBuddy Real-Time Architecture

## Overview

SpeakBuddy uses **Socket.IO** on top of the existing Express backend to provide real-time communication.

The current real-time architecture supports:

- Socket authentication
- User-specific socket rooms
- 1-to-1 matchmaking
- Preference-based matchmaking
- Conversation rooms
- Real-time text chat
- Conversation lifecycle management
- Conversation end notifications

The architecture is designed so that **WebRTC can later be added for voice and video communication**.

---

## 1. Architecture

    React Frontend
          │
          │ Socket.IO
          ▼
    Socket.IO Server
          │
          ├── Socket Authentication
          ├── Matchmaking
          ├── Conversation Rooms
          └── Real-Time Events
          │
          ▼
    Express Backend
          │
          ▼
    PostgreSQL + Prisma

The database remains the source of truth for persistent conversation information.

Socket.IO is responsible for real-time communication and room management.

---

## 2. Socket Authentication

When a user connects to Socket.IO, the backend authenticates the socket using the existing JWT stored in the authentication cookie.

### Flow

    Frontend connects
          ↓
    Socket handshake
          ↓
    Read JWT from cookie
          ↓
    Verify JWT
          ↓
    Find user in database
          ↓
    Validate account
          ↓
    Attach userId to socket.data
          ↓
    Connection accepted

The authenticated user ID is stored as:

    socket.data.userId

This prevents the frontend from deciding which user a socket belongs to.

---

## 3. User Rooms

When a socket connects, it joins a personal room:

    socket.join(`user:${userId}`);

Example:

    user:123

These rooms allow the backend to send events specifically to a user.

For example:

    io.to(`user:${userId}`).emit("match:found", ...);

This is useful for events that should reach all active sockets belonging to the same user.

---

## 4. Matchmaking

SpeakBuddy uses an in-memory matchmaking queue for the MVP.

    const waitingUsers = new Map();

Each waiting user stores:

    userId
    socketId
    topicId
    interests
    languageProficiency

### Matchmaking Flow

    User requests match
            ↓
    Fetch authenticated user's profile
            ↓
    Find users waiting for the same topic
            ↓
    Calculate match scores
            ↓
    Remove incompatible candidates
            ↓
    Select highest-scoring candidate
            ↓
    Create Conversation in database
            ↓
    Create Socket.IO conversation room
            ↓
    Notify both users

---

## 5. Matchmaking Rules

### Topic

Topic is a **hard requirement**.

Users can only be matched when:

    candidate.topicId === requested.topicId

Different topics cannot match.

### Language Proficiency

Language proficiency contributes priority points.

| Difference | Score |
|---|---:|
| Same level | 3 |
| 1 level apart | 2 |
| 2 levels apart | 1 |
| 3+ levels apart | 0 |

One pair is incompatible:

    BEGINNER ↔ PROFICIENT

This produces a proficiency score of:

    -1

A candidate with a score of `-1` is rejected.

### Shared Interests

Shared interests contribute additional priority points.

    0 shared interests → 0 points
    1 shared interest  → 1 point
    2 shared interests → 2 points
    3 shared interests → 3 points
    ...

Interests are a **preference**, not a hard requirement.

Therefore, users with no shared interests can still match.

### Total Match Score

The final score is:

    Proficiency Score + Interest Score

Example:

    Proficiency: 3
    Interests:   2
    ----------------
    Total:       5

The candidate with the highest compatible score is selected.

If multiple candidates have the same score, the current implementation keeps the first candidate encountered.

---

## 6. Conversation Creation

When a match is found, a persistent `Conversation` record is created in PostgreSQL.

The conversation contains:

    user1Id
    user2Id
    topicId
    status
    startedAt

The initial status is:

    ACTIVE

The database conversation ID becomes the identifier for the real-time conversation.

---

## 7. Conversation Rooms

After creating the conversation, both sockets join:

    conversation:${conversationId}

Example:

    conversation:8f5c...

The room allows messages and conversation events to be routed only to the participants.

---

## 8. Match Found Event

When a conversation is created, both users receive:

    match:found

The payload contains:

    {
      matchedUserId,
      conversationId
    }

The frontend uses the conversation ID to connect the conversation UI to the correct Socket.IO room.

---

## 9. Real-Time Text Chat

The frontend sends:

    socket.emit("message:send", {
      conversationId,
      text,
    });

The backend broadcasts the message to the conversation room:

    socket
      .to(`conversation:${conversationId}`)
      .emit("message:receive", {
        text,
        senderId: userId,
      });

The sender is intentionally excluded using:

    socket.to(...)

because the sender already adds their own message locally.

### Message Flow

    User A
      │
      │ message:send
      ▼
    Backend
      │
      │ message:receive
      ▼
    User B

Messages are currently **not persisted in the database**.

---

## 10. Ending a Conversation

Either participant can end an active conversation.

The frontend sends:

    socket.emit("conversation:end", {
      conversationId,
    });

The backend:

1. Finds the conversation.
2. Identifies the other participant.
3. Calculates the conversation duration.
4. Updates the database.
5. Sets status to `COMPLETED`.
6. Sets `endedAt`.
7. Stores the duration.
8. Removes both sockets from the conversation room.
9. Notifies the other participant.

The conversation status changes:

    ACTIVE → COMPLETED

The partner receives:

    conversation:ended

The frontend then clears the active conversation state.

---

## 11. Conversation Duration

Duration is calculated using:

    endedAt - startedAt

and stored in seconds.

Example:

    Started:  20:00:00
    Ended:    20:12:35
    Duration: 755 seconds

---

## 12. Current MVP State

The following functionality has been implemented:

- [x] Socket.IO server
- [x] Socket authentication
- [x] User socket rooms
- [x] Matchmaking queue
- [x] Topic-based matching
- [x] Proficiency scoring
- [x] Interest scoring
- [x] Compatibility filtering
- [x] Highest-score candidate selection
- [x] Database-backed conversations
- [x] Conversation Socket.IO rooms
- [x] Match found events
- [x] Real-time text chat
- [x] Conversation ending
- [x] Conversation duration tracking
- [x] Partner conversation-end notification

---

## 13. Next Real-Time Feature: Group Discussions

The next real-time layer will be **Group Discussions**.

The planned flow is:

    Scheduled Group Discussion
            ↓
    Reservation
            ↓
    Participant joins
            ↓
    Group Socket.IO room
            ↓
    Real-time group chat

Group Discussions will build on the same Socket.IO infrastructure already used for 1-to-1 conversations.

---

## 14. WebRTC Roadmap

After Group Discussions, the next major real-time feature will be **WebRTC**.

WebRTC will handle:

- Voice calls
- Video calls

Socket.IO will remain responsible for **signaling**.

### Architecture

    Socket.IO
    Signaling Layer
          │
    ┌─────┴─────┐
    │           │
  User A      User B
    │           │
    └── WebRTC ─┘
       Media Layer

Socket.IO will exchange the information required to establish the WebRTC connection, including:

- Offers
- Answers
- ICE candidates

WebRTC will then establish the peer-to-peer media connection.

---

## 15. Scaling Considerations

The current matchmaking queue is stored in Node.js memory:

    Map<string, WaitingUser>

This is appropriate for the MVP.

For a larger production deployment with multiple backend instances, matchmaking state would eventually need to move to shared infrastructure such as Redis.

Similarly, Socket.IO scaling would require a shared adapter when running multiple server instances.

These optimizations are intentionally deferred until they are actually required.

---

## Summary

SpeakBuddy's current real-time architecture separates responsibilities:

    PostgreSQL
        ↓
    Persistent conversation state

    Socket.IO
        ↓
    Real-time events, rooms, matchmaking and chat

    WebRTC
        ↓
    Future voice and video media

The current Socket.IO implementation provides the foundation for moving from 1-to-1 conversations to Group Discussions and eventually real-time voice/video communication.