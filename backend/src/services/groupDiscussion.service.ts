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
  })
    .include("topic")
    .include("reservations")
    .all();

  const now = Date.now();

  //1. Get the discussions whose scheduled time is in future
  //2. Take each discussion and add extra property participant count
  //3. Participant count is number of particpants whose reservation status is reserved
  //4. reservations is coming from the relationship of prisma model 

  return discussions
    .filter(
      (discussion) =>
        discussion.scheduledStartAt &&
        new Date(discussion.scheduledStartAt).getTime() >= now,
    )
    .map((discussion) => ({
      ...discussion,
      participantCount: discussion.reservations.filter(
        (reservation) => reservation.status === "RESERVED",  //number of reserved - participant count
      ).length,
    }));
};

export const getAllGroupDiscussionsForAdmin = async () => {
  const discussions = await db.orm.public.GroupDiscussion.include("topic")
    .include("reservations")
    .all();

  return discussions.map((discussion) => ({
    ...discussion,
    participantCount: discussion.reservations.filter(
      (reservation) => reservation.status === "RESERVED",
    ).length,
  }));
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

export const enterGroupDiscussionWaitingRoom = async (
  groupDiscussionId: string,
  userId: string,
) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

if (discussion.status !== "WAITING" && discussion.status !== "ACTIVE") {
  throw new Error("WAITING_ROOM_NOT_AVAILABLE");
}

  const reservation = await db.orm.public.GroupReservation.where({
    groupDiscussionId,
    userId,
  }).first();

  if (!reservation) {
    throw new Error("RESERVATION_REQUIRED");
  }

  if (reservation.status !== "RESERVED") {
    throw new Error("RESERVATION_NOT_ACTIVE");
  }

  return discussion;
};


export const joinGroupDiscussion = async (
  groupDiscussionId: string,
  userId: string,
) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  }).first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

  if (discussion.status !== "ACTIVE") {
    throw new Error("GROUP_DISCUSSION_NOT_ACTIVE");
  }

  const reservation = await db.orm.public.GroupReservation.where({
    groupDiscussionId,
    userId,
  }).first();

  if (!reservation || reservation.status !== "RESERVED") {
    throw new Error("RESERVATION_REQUIRED");
  }

  const existingParticipant = await db.orm.public.GroupParticipant.where({
    groupDiscussionId,
    userId,
  }).first();

  if (existingParticipant) {
    return existingParticipant;
  }

  return await db.orm.public.GroupParticipant.create({
    groupDiscussionId,
    userId,
    joinedAt: new Date().toISOString(),
  });
};

export const leaveGroupDiscussion = async (
  groupDiscussionId: string,
  userId: string,
) => {
  const participant = await db.orm.public.GroupParticipant.where({
    groupDiscussionId,
    userId,
  }).first();

  if (!participant) {
    throw new Error("PARTICIPANT_NOT_FOUND");
  }

  if (participant.leftAt) {
    throw new Error("PARTICIPANT_ALREADY_LEFT");
  }

  return await db.orm.public.GroupParticipant.where({
    id: participant.id,
  }).update({
    leftAt: new Date().toISOString(),
  });
};

export const getGroupDiscussionById = async (groupDiscussionId: string) => {
  const discussion = await db.orm.public.GroupDiscussion.where({
    id: groupDiscussionId,
  })
    .include("topic")
    .first();

  if (!discussion) {
    throw new Error("GROUP_DISCUSSION_NOT_FOUND");
  }

  return discussion;
};