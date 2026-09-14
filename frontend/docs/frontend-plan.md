# SpeakBuddy — Frontend Plan

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Separate frontend from the Express backend

## Design Philosophy

- Simple
- Premium
- Clean
- Minimal
- Easy to navigate
- No unnecessary pages or complexity

## Core User Flow

### New User

Register
↓
Build Profile
↓
Home

### Returning User

Login
↓
Home

## Main Screens

- `/login` — User login
- `/register` — User registration
- `/setup-profile` — Build profile after registration
- `/home` — Main application screen
- `/conversation/:id` — One-on-one conversation
- `/groups` — Group discussions
- `/groups/:id` — Individual group discussion
- `/profile` — User profile

## Home

The main screen of SpeakBuddy.

It will contain:

- User's profile information
- Start Conversation button
- Recent conversations

The primary action is:

**Start Conversation**

## Starting a Conversation

When the user clicks **Start Conversation**:

1. A modal/pop-up opens.
2. User selects the conversation topic/preferences.
3. User clicks **Find Partner**.
4. Backend handles matchmaking.
5. User enters the conversation.

## Conversation

- One-on-one real-time conversation
- Uses WebSocket/Socket.IO
- After the conversation ends, the user can rate the other participant.

## Groups

- Separate section for group discussions
- Kept simple and independent from one-on-one conversations

## Profile

- View user's profile
- Edit profile information

## Navigation Philosophy

Keep navigation minimal.

The core experience should revolve around:

**Home → Start Conversation → Match → Talk → Rate**

No unnecessary dashboards, pages, or features should be added unless the product requires them.

## Application Experience

SpeakBuddy will be designed as a **responsive web application**, not a traditional website.

- App-like experience on desktop and mobile
- Mobile-first responsive behavior where appropriate
- Persistent, minimal navigation
- Controlled application layout
- Modals for short actions instead of unnecessary pages
- Smooth transitions and interactions
- Chat experience optimized for mobile
- UI should feel like a polished native app while remaining a web app