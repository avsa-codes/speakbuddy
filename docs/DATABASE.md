# SpeakBuddy — Database Design

## 1. Logical Design

### Entities

#### User

Represents a registered SpeakBuddy user.

Stores:

- Account information
- Profile information
- English proficiency
- Interests
- Rating summary
- Account status

#### Rating

Represents a rating given by one user to another after a 1-to-1 conversation.

#### Conversation

Represents a 1-to-1 conversation session between two users.

Stores:

- Two participants
- Topic
- Session status
- Start/end time
- Duration

#### Topic

Represents a predefined topic that can be assigned to conversations or group discussions.

#### GroupDiscussion

Represents a pre-created group discussion session.

Stores:

- Topic
- Maximum participant limit
- Session status
- Start/end time
- Duration

#### GroupParticipant

Represents a user's participation in a group discussion.

Stores:

- User
- Group discussion
- Join/leave timestamps

---

## 2. Relationships

### Symbols

- `1:N` = One-to-Many
- `N:1` = Many-to-One
- `N:M` = Many-to-Many

### User → Rating

**1:N — Reviewer relationship**

- One User can give many Ratings.
- Each Rating has one reviewer.
- `Rating.reviewerId` → `User.id`

**1:N — Reviewed user relationship**

- One User can receive many Ratings.
- Each Rating belongs to one reviewed user.
- `Rating.reviewedUserId` → `User.id`

### User → Conversation

**1:N — First participant relationship**

- One User can participate in many Conversations as `user1`.
- Each Conversation has one `user1`.
- `Conversation.user1Id` → `User.id`

**1:N — Second participant relationship**

- One User can participate in many Conversations as `user2`.
- Each Conversation has one `user2`.
- `Conversation.user2Id` → `User.id`

Each Conversation therefore has exactly two users.

### Topic → Conversation

**1:N**

- One Topic can be used by many Conversations.
- Each Conversation has one Topic.
- `Conversation.topicId` → `Topic.id`

### Topic → GroupDiscussion

**1:N**

- One Topic can be used by many GroupDiscussions.
- Each GroupDiscussion has one Topic.
- `GroupDiscussion.topicId` → `Topic.id`

### User ↔ GroupDiscussion

**N:M**

- One User can participate in many GroupDiscussions.
- One GroupDiscussion can have many Users.
- The relationship is implemented through `GroupParticipant`.

### User → GroupParticipant

**1:N**

- One User can have many GroupParticipant records.
- Each GroupParticipant belongs to one User.
- `GroupParticipant.userId` → `User.id`

### GroupDiscussion → GroupParticipant

**1:N**

- One GroupDiscussion can have many GroupParticipant records.
- Each GroupParticipant belongs to one GroupDiscussion.
- `GroupParticipant.groupDiscussionId` → `GroupDiscussion.id`

---

## 3. Physical Design

### Enums

#### LanguageProficiency

- `BEGINNER`
- `ELEMENTARY`
- `INTERMEDIATE`
- `UPPER_INTERMEDIATE`
- `ADVANCED`
- `PROFICIENT`

#### SessionStatus

- `WAITING`
- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

`SessionStatus` is used by both Conversation and GroupDiscussion.

---

### User

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `name` | User's name | |
| `username` | User's username | Unique |
| `email` | Unique login email | Unique |
| `password` | Hashed password | |
| `isEmailVerified` | Email verification status | |
| `bio` | User bio | |
| `languageProficiency` | English proficiency level | Enum |
| `interests` | User interests | |
| `rating` | Current average rating | |
| `totalRatings` | Number of received ratings | |
| `isDeleted` | Soft-delete status | |
| `createdAt` | Account creation time | |
| `updatedAt` | Last update time | |

---

### Rating

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `rating` | Rating value (1–5) | CHECK 1–5 |
| `reviewerId` | User giving the rating | FK → User.id |
| `reviewedUserId` | User receiving the rating | FK → User.id |
| `createdAt` | Rating creation time | |

---

### Conversation

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `user1Id` | First participant | FK → User.id |
| `user2Id` | Second participant | FK → User.id |
| `topicId` | Assigned topic | FK → Topic.id |
| `status` | Session status | Enum |
| `startedAt` | Session start time | |
| `endedAt` | Session end time | |
| `duration` | Session duration | |
| `createdAt` | Record creation time | |

---

### Topic

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `title` | Topic title | |
| `description` | Topic details | |
| `createdAt` | Creation time | |
| `updatedAt` | Last update time | |

---

### GroupDiscussion

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `topicId` | Assigned topic | FK → Topic.id |
| `maxParticipants` | Maximum allowed participants | |
| `status` | Session status | Enum |
| `startedAt` | Session start time | |
| `endedAt` | Session end time | |
| `duration` | Session duration | |
| `createdAt` | Creation time | |
| `updatedAt` | Last update time | |

---

### GroupParticipant

| Field | Purpose | Key / Constraint |
|---|---|---|
| `id` | Primary key | PK |
| `groupDiscussionId` | Group discussion | FK → GroupDiscussion.id |
| `userId` | Participating user | FK → User.id |
| `joinedAt` | Join time | |
| `leftAt` | Leave time | |
| | | **UNIQUE (`userId`, `groupDiscussionId`)** |

---

## 4. Constraints

- Every table has a primary key.
- User email must be unique.
- User username must be unique.
- Rating values must be between 1 and 5.
- A user cannot rate themselves.
- Conversation participants must be different users.
- Foreign keys must reference valid records.
- A user can participate only once in the same GroupDiscussion.
- Passwords are stored only as secure hashes.
- `User.rating` stores the current average rating.
- `User.totalRatings` stores the total number of received ratings.
- Rating eligibility must be validated by the backend so that a user can only rate another user after a valid completed conversation.
- GroupDiscussion participant count must not exceed `maxParticipants`.

---

## 5. Indexes

Indexes should be created based on frequently executed queries and access patterns.

### User

- `email` — unique index
- `username` — unique index

### Rating

- `reviewerId`
- `reviewedUserId`

### Conversation

- `user1Id`
- `user2Id`
- `topicId`
- `status`

### GroupDiscussion

- `topicId`
- `status`

### GroupParticipant

- `userId`
- Composite unique constraint on `(userId, groupDiscussionId)`

> Unique constraints already create indexes, so duplicate indexes should not be added unnecessarily.

---

## 6. Delete Behavior

- Users use soft deletion through `isDeleted`.
- User records should not be hard-deleted in the MVP because they are referenced by historical data.
- Historical Conversations, Ratings, and GroupParticipant records should remain available.
- Topics used by existing Conversations or GroupDiscussions should not be hard-deleted.
- GroupParticipant records are dependent on their GroupDiscussion and may be deleted when the parent GroupDiscussion is deleted.
- GroupDiscussion records are system-created and do not have a creator relationship.

---

## 7. Non-Persistent Data

### Temporary Chat

Chat messages are **not stored in the database**.

- Messages exist only during the active session.
- Socket.IO handles real-time message delivery.
- Messages disappear when the session ends.

### Voice and Video

Voice/video data is **not stored in the database**.

- WebRTC handles the actual audio/video communication.
- Socket.IO handles WebRTC signaling and real-time session events.
- The database stores only session metadata such as participants, topic, status, timestamps, and duration.


 Edit contract.prisma
          ↓
2. npx prisma@latest contract emit
          ↓
3. npx prisma@latest migration plan --name add_group_reservations
          ↓
4. REVIEW generated migration
          ↓
5. npx prisma@latest migration status
          ↓
6. npx prisma@latest migrate --show
          ↓
7. npx prisma@latest migrate