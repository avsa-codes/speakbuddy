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