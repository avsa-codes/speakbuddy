import { db } from "./db";

async function main() {
  // -------------------------
  // 1. Create Users
  // -------------------------

  const user1 = await db.orm.public.User.create({
    email: "rahul@example.com",
    username: "rahul",
    name: "Rahul Sharma",
    password: "password123",
    isEmailVerified: true,
    bio: "I enjoy discussing technology and travel.",
    interests: ["Technology", "Travel", "Programming"],
    languageProficiency: "INTERMEDIATE",
  });

  const user2 = await db.orm.public.User.create({
    email: "aisha@example.com",
    username: "aisha",
    name: "Aisha Khan",
    password: "password123",
    isEmailVerified: true,
    bio: "I want to improve my English through conversations.",
    interests: ["Movies", "Books", "Travel"],
    languageProficiency: "UPPER_INTERMEDIATE",
  });

  // -------------------------
  // 2. Create Topics
  // -------------------------

  const topic1 = await db.orm.public.Topic.create({
    title: "Travel",
    description:
      "Talk about travel experiences, destinations, and future travel plans.",
  });

  const topic2 = await db.orm.public.Topic.create({
    title: "Technology",
    description:
      "Discuss programming, gadgets, artificial intelligence, and technology.",
  });

  // -------------------------
  // 3. Create Conversations
  // -------------------------

  const conversation1 = await db.orm.public.Conversation.create({
    user1Id: user1.id,
    user2Id: user2.id,
    topicId: topic1.id,
    status: "COMPLETED",
    startedAt: "2026-09-01 10:00:00+05:30",
    endedAt: "2026-09-01 10:30:00+05:30",
    duration: 1800,
  });

  const conversation2 = await db.orm.public.Conversation.create({
    user1Id: user2.id,
    user2Id: user1.id,
    topicId: topic2.id,
    status: "ACTIVE",
    startedAt: "2026-09-05 17:00:00+05:30",
  });

  // -------------------------
  // 4. Create Ratings
  // -------------------------

  const rating1 = await db.orm.public.Rating.create({
    rating: 5,
    reviewerId: user1.id,
    reviewedUserId: user2.id,
  });

  const rating2 = await db.orm.public.Rating.create({
    rating: 4,
    reviewerId: user2.id,
    reviewedUserId: user1.id,
  });

  // -------------------------
  // 5. Create Group Discussions
  // -------------------------

  const group1 = await db.orm.public.GroupDiscussion.create({
    topicId: topic1.id,
    maxParticipants: 4,
    status: "ACTIVE",
    startedAt: "2026-09-05 16:00:00+05:30",
  });

  const group2 = await db.orm.public.GroupDiscussion.create({
    topicId: topic2.id,
    maxParticipants: 4,
    status: "WAITING",
  });

  // -------------------------
  // 6. Add Users to Groups
  // -------------------------

  const participant1 = await db.orm.public.GroupParticipant.create({
    groupDiscussionId: group1.id,
    userId: user1.id,
    joinedAt: "2026-09-05 16:05:00+05:30",
  });

  const participant2 = await db.orm.public.GroupParticipant.create({
    groupDiscussionId: group1.id,
    userId: user2.id,
    joinedAt: "2026-09-05 16:07:00+05:30",
  });

  const participant3 = await db.orm.public.GroupParticipant.create({
    groupDiscussionId: group2.id,
    userId: user1.id,
    joinedAt: "2026-09-05 17:10:00+05:30",
  });

  const participant4 = await db.orm.public.GroupParticipant.create({
    groupDiscussionId: group2.id,
    userId: user2.id,
    joinedAt: "2026-09-05 17:12:00+05:30",
  });

  console.log("Database seeded successfully!");

  console.log({
    users: [user1, user2],
    topics: [topic1, topic2],
    conversations: [conversation1, conversation2],
    ratings: [rating1, rating2],
    groupDiscussions: [group1, group2],
    groupParticipants: [participant1, participant2, participant3, participant4],
  });
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
