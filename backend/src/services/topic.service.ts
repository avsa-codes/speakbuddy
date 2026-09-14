import { db } from "../prisma/db";

export const fetchAllTopics = async () => {
  const topics = await db.orm.public.Topic.select(
    "id",
    "title",
    "description",
  ).all();

  return topics;
};

export const fetchTopicById = async (topicId: string) => {
  const topic = await db.orm.public.Topic.select(
    "id",
    "title",
    "description",
  ).first({ id: topicId });

  return topic;
};

export const postTopic = async (data: { title: string; description: string }) => {
  const topic = await db.orm.public.Topic.create({
    title: data.title,
    description: data.description,
  });

  return topic;
};

export const editTopic = async ( id: string, data: {
  title: string;
  description: string;
}) => {
  const topic = await db.orm.public.Topic.where({id}).update({
    title: data.title,
    description: data.description,
  });

  return topic;
};

export const removeTopicById = async (id: string) => {
  try {
    const topic = await db.orm.public.Topic.where({ id }).delete();

    return topic;
  } catch (error: any) {
    if (error.message.includes("violates RESTRICT setting")) {
      throw new Error("TOPIC_IN_USE");
    }

    throw error;
  }
};