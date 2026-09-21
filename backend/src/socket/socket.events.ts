import type { Server, Socket } from "socket.io";
import waitingUsers from "./matchmaking.queue.js";
import activeConversations from "./conversation.map.js";
import { createConversation, endConversation } from "../services/conversation.service.js";
import { fetchUserProfile } from "../services/user.service.js";
import { getMatchScore } from "./matching.utils.js";

export const registerSocketEvents = (io: Server, socket: Socket) => {
  const userId = socket.data.userId;

  socket.join(`user:${userId}`);

  console.log(`User ${userId} connected via socket ${socket.id}`);
  console.log(`User ${userId} joined room: user:${userId}`);

  io.to(`user:${userId}`).emit("socket:ready", {
    message: "Socket connection established",
  });

  socket.on("match:request", async (data) => {
    const { topicId } = data;
    
    const user = await fetchUserProfile(userId);

    if(!user){
      return;
    }

    console.log("Current queue:", [...waitingUsers.values()]);
    console.log("Requested topic:", topicId);

    const candidates = [...waitingUsers.values()].filter(
      (candidate) => candidate.topicId === topicId && candidate.userId !== userId,
    );

    const scoredCandidates = candidates.map((candidate) => {
      const score = getMatchScore(
        user.languageProficiency,
        candidate.languageProficiency,
        user.interests,
        candidate.interests,
      );

      return {
        ...candidate,
        score,
      };
    });


    /*
    {
  userId,
  socketId,
  topicId,
  interests,
  languageProficiency,
  score: 5
}*/

    const compatibleCandidates = scoredCandidates.filter(
      (candidate) => candidate.score >= 0,
    );

    type ScoredCandidate = (typeof compatibleCandidates)[number];

  const bestCandidate = compatibleCandidates.reduce<ScoredCandidate | null>(
    (best, candidate) => {
      if (!best || candidate.score > best.score) {
        return candidate;
      }

      return best;
    },
    null,
  );

if (bestCandidate) {
  console.log(`MATCH FOUND: ${userId} ↔ ${bestCandidate.userId}`);

  waitingUsers.delete(bestCandidate.userId);

  const conversation = await createConversation({
    user1Id: userId,
    user2Id: bestCandidate.userId,
    topicId,
  });

  socket.join(`conversation:${conversation.id}`);

  const partnerSocket = io.sockets.sockets.get(bestCandidate.socketId);

  partnerSocket?.join(`conversation:${conversation.id}`);

  io.to(`user:${userId}`).emit("match:found", {
    matchedUserId: bestCandidate.userId,
    conversationId: conversation.id,
  });

  io.to(`user:${bestCandidate.userId}`).emit("match:found", {
    matchedUserId: userId,
    conversationId: conversation.id,
  });

  return;
}
waitingUsers.set(userId, {
  userId,
  socketId: socket.id,
  topicId,
  interests: user.interests ?? null,
  languageProficiency: user.languageProficiency ?? null,
});

    console.log(`User ${userId} is waiting for topic ${topicId}`);
  });

  socket.on("message:send", (data) => {
    const { conversationId, text } = data;

    if (!conversationId) {
      return;
    }

    socket.to(`conversation:${conversationId}`).emit("message:receive", {
      text,
      senderId: userId,
    });
  });

  socket.on("match:cancel", () => {
    waitingUsers.delete(userId);
    console.log(`User ${userId} cancelled matchmaking`);
  })

  socket.on("conversation:end", async (data) => {
    const {conversationId} = data;

    if(!conversationId){
      return;
    }

    const result = await endConversation(conversationId, userId);

    if (!result) {
      return;
    }

    const { partnerUserId } = result;

    socket.leave(`conversation:${conversationId}`);

    const room = io.sockets.adapter.rooms.get(
      `conversation:${conversationId}`
    );

    if(room){
      for(const socketId of room){
        const partnerSocket = io.sockets.sockets.get(socketId);

        partnerSocket?.leave(`conversation:${conversationId}`);
      }
    }

    io.to(`user:${partnerUserId}`).emit("conversation:ended");
  });

  socket.on("conversation:recover", () => {
    const partnerUserId = activeConversations.get(userId);

    if (!partnerUserId) {
      return;
    }

    socket.emit("conversation:recovered", {
      partnerUserId,
    });
  });
};
