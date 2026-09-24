import { db } from "../prisma/db.js";

export const createGroupDiscussion = async (data: {
  topicId: string;
  maxParticipants: number;
  scheduledStartAt: string;
}) => {
  return await db.orm.public.GroupDiscussion.create({
    topicId: data.topicId,
    maxParticipants: data.maxParticipants,
    status: "WAITING",
    scheduledStartAt: data.scheduledStartAt,
  });
};

export const getUpcomingGroupDiscussions = async () => {
  const discussions = await db.orm.public.GroupDiscussion.where({
    status: "WAITING",
  }).all();

  const now = new Date().toISOString();

  return discussions.filter(
    (discussion) =>
      discussion.scheduledStartAt && discussion.scheduledStartAt >= now,
  );
};


export const reserveGroupDiscussion = async (
  groupDiscussionId: string,
  userId: string,
) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

  if (discussion.status !== "WAITING") {
    throw new Error("GROUP_DISCUSSION_NOT_AVAILABLE");
  }

  const existingReservation = await db.orm.public.GroupReservation.where({
    groupDiscussionId,
    userId,
  }).first();

  if (existingReservation) {
    throw new Error("ALREADY_RESERVED");
  }

const reservations = await db.orm.public.GroupReservation.where({
  groupDiscussionId,
  status: "RESERVED",
}).all();

const reservationCount = reservations.length;

  if (reservationCount >= discussion.maxParticipants) {
    throw new Error("GROUP_DISCUSSION_FULL");
  }

  return await db.orm.public.GroupReservation.create({
    groupDiscussionId,
    userId,
    status: "RESERVED",
  });
};

export const cancelGroupDiscussionReservation = async (
  groupDiscussionId: string,
  userId: string,
) => {
  const reservation = await db.orm.public.GroupReservation.where({
    groupDiscussionId,
    userId,
  }).first();

  if (!reservation) {
    throw new Error("RESERVATION_NOT_FOUND");
  }

  if (reservation.status !== "RESERVED") {
    throw new Error("RESERVATION_CANNOT_BE_CANCELLED");
  }

  return await db.orm.public.GroupReservation.where({
    id: reservation.id,
  }).update({
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
  });
};


export const getUserGroupDiscussionReservation = async (
  groupDiscussionId: string,
  userId: string,
) => {
  return await db.orm.public.GroupReservation.where({
    groupDiscussionId,
    userId,
  }).first();
};



export const startGroupDiscussion = async (groupDiscussionId: string) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

  if (discussion.status !== "WAITING") {
    throw new Error("GROUP_DISCUSSION_CANNOT_BE_STARTED");
  }

  return await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).update({
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
  });
};


export const endGroupDiscussion = async (groupDiscussionId: string) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

  if (discussion.status !== "ACTIVE") {
    throw new Error("GROUP_DISCUSSION_CANNOT_BE_ENDED");
  }

  const endedAt = new Date().toISOString();

  const duration = discussion.startedAt
    ? Math.floor(
        (new Date(endedAt).getTime() -
          new Date(discussion.startedAt).getTime()) /
          1000,
      )
    : 0;

  return await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).update({
    status: "COMPLETED",
    endedAt,
    duration,
  });
};