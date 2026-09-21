import { db } from "../prisma/db";

export const postConversation = async (data: {
  title: string;
  description: string;
}) => {
  const topic = await db.orm.public.Topic.create({
    title: data.title,
    description: data.description,
  });

  return topic;
};


export const createConversation = async (data: {
  user1Id: string;
  user2Id: string;
  topicId: string;
}) => {
  return await db.orm.public.Conversation.create({
    user1Id: data.user1Id,
    user2Id: data.user2Id,
    topicId: data.topicId,
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
  });
};

export const endConversation = async (
  conversationId: string,
  userId: string,
) => {
  const conversation = await db.orm.public.Conversation.where({
    id: conversationId,
  }).first();

  if (!conversation) {
    return null;
  }

  const partnerUserId =
    conversation.user1Id === userId
      ? conversation.user2Id
      : conversation.user1Id;

  const endedAt = new Date().toISOString();

  const duration = Math.floor(
    (new Date(endedAt).getTime() -
      new Date(conversation.startedAt!).getTime()) /
      1000,
  );

  const updatedConversation = await db.orm.public.Conversation.where({
    id: conversationId,
  }).update({
    status: "COMPLETED",
    endedAt,
    duration,
  });

  return {
    partnerUserId,
    conversation: updatedConversation,
  };
};