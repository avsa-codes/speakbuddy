# SpeakBuddy — MVP Matching Logic

## Goal

The goal of SpeakBuddy's MVP matching system is to match two users who are as compatible as possible for a meaningful conversation, while keeping the matching logic simple and predictable.

We will **not** build a complex AI-based matching/scoring system initially.

---

## Matching Factors

### 1. Topic — Highest Priority

The topic selected by the user starting the conversation is the primary matching factor.

Example:

- User A selects **Movies**
- User B is waiting for **Movies**
- → They can be matched.

The MVP will intentionally keep the number of available topics relatively small.

---

### 2. Interests — Priority After Topic

Users have control over their own interests.

When looking for a match, users with overlapping interests should receive higher priority.

Interest comparison should be **case-insensitive**.

Therefore:

```text
Music
music
MUSIC

## Proficiency Level — Compatibility Factor

The user's selected proficiency level should also be considered.

We should not require both users to have exactly the same proficiency level.

Beginner ↔ Intermediate       Compatible
Intermediate ↔ Intermediate   Compatible
Intermediate ↔ Advanced       Compatible
Beginner ↔ Advanced           Lower compatibility