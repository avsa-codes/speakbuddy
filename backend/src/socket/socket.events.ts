import type { Server, Socket } from "socket.io";
import waitingUsers from "./matchmaking.queue.js";
import activeConversations from "./conversation.map.js";
import { createConversation, endConversation } from "../services/conversation.service.js";
import { fetchUserProfile } from "../services/user.service.js";
import { getMatchScore } from "./matching.utils.js";
import { endGroupDiscussion } from "../services/groupDiscussion.service.js";
import { db } from "../prisma/db.js";
import { leaveGroupDiscussion } from "../services/groupDiscussion.service.js";
import pendingCalls from "./call.registry.js";

export const registerSocketEvents = (io: Server, socket: Socket) => {


  const userId = socket.data.userId;

  const broadcastConnectionCount = () => {
    const count = [...io.sockets.sockets.values()].filter((connectedSocket) =>
      Boolean(connectedSocket.data.userId),
    ).length;

    io.emit("connections:count", count);
  };

  socket.join(`user:${userId}`);
  broadcastConnectionCount();

  // console.log(`User ${userId} connected via socket ${socket.id}`);
  // console.log(`User ${userId} joined room: user:${userId}`);

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
    socket.emit("conversation:ended");
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

  socket.on("group:join",
    async({groupDiscussionId} : {groupDiscussionId: string}) => { //destructuring logic

      const participant = await db.orm.public.GroupParticipant.where({
        userId,
        groupDiscussionId
      }).first();

      if (!participant || participant.leftAt) {
        socket.emit("group:error", {
          message: "You are not an active participant for this discussion.",
        });
        return;
      }

      const discussion = await db.orm.public.GroupDiscussion.where({id: groupDiscussionId})
      .first();

      if(!discussion){
        socket.emit("group:error", {
          message: "Group discussion not found.",
        });
        return;
      };

      if(discussion.status !== "ACTIVE"){
         socket.emit("group:error", {
           message: "Group discussion is not active.",
         });
         return;
      }

      const roomName = `group:${groupDiscussionId}`;
      socket.join(roomName);
      socket.data.groupDiscussionId = groupDiscussionId;

      socket.to(roomName).emit("group:participant-joined", { //Everyone else   → group:participant-joined
        userId,
      });

      socket.emit("group:joined", { //That user       → group:joined
        groupDiscussionId,
      })
    }
  );

  socket.on(
    "group:leave",
    async ({ groupDiscussionId }: { groupDiscussionId: string }) => {
      const userId = socket.data.userId;

      try {
        await leaveGroupDiscussion(groupDiscussionId, userId);

        const roomName = `group:${groupDiscussionId}`;

        socket.leave(roomName);
        socket.data.groupDiscussionId = undefined;

        socket.emit("group:left", {
          groupDiscussionId,
        });

        socket.to(roomName).emit("group:participant-left", {
          userId,
        });
      } catch (error) {
        socket.emit("group:error", {
          message: "Unable to leave group discussion.",
        });
      }
    },
  );

  socket.on("group:message", async({
    groupDiscussionId,
    text
  }: {
    groupDiscussionId: string,
     text: string
  }) => {
    const userId = socket.data.userId;

    if (!text?.trim()) {
      socket.emit("group:error", {
        message: "Message cannot be empty.",
      });
      return;
    }


    const participant = await db.orm.public.GroupParticipant.where({
      groupDiscussionId,
      userId,
    }).first();

    if (!participant || participant.leftAt) {
      socket.emit("group:error", {
        message: "You are not an active participant in this discussion.",
      });
      return;
    }

     const discussion = await db.orm.public.GroupDiscussion.where({
       id: groupDiscussionId,
     }).first();

     if (!discussion) {
       socket.emit("group:error", {
         message: "Group discussion not found.",
       });
       return;
     }

     if (discussion.status !== "ACTIVE") {
       socket.emit("group:error", {
         message: "Group discussion is not active.",
       });
       return;
     }



     const roomName = `group:${groupDiscussionId}`;

     if (!socket.rooms.has(roomName)) {
       socket.emit("group:error", {
         message: "You are not connected to this discussion.",
       });
       return;
     }

     const sender = await db.orm.public.User.where({ id: userId }).first();

    socket.to(roomName).emit("group:message", {
      text: text.trim(),
      senderId: userId,
      senderName: sender?.name ?? "Participant",
      sentAt: new Date().toISOString(),
    });

  });

socket.on("disconnect", async () => {
  broadcastConnectionCount();

  const groupDiscussionId = socket.data.groupDiscussionId;

  if (!groupDiscussionId) return;

  try {
    await leaveGroupDiscussion(groupDiscussionId, userId);

    socket.to(`group:${groupDiscussionId}`).emit("group:participant-left", {
      userId,
    });
  } catch (error) {
    console.error("Failed to handle group participant disconnect:", error);
  }
});

  //Video/Audio Implementation

     
  socket.on(
    "call:invite",
    async (data: { conversationId: string; callType: "audio" | "video" }) => {
      try {
        const { conversationId, callType } = data;

        if (!conversationId || !["audio", "video"].includes(callType)) {
          socket.emit("call:error", {
            message: "Invalid call invitation.",
          });
          return;
        }

        const conversation = await db.orm.public.Conversation.where({
          id: conversationId,
        }).first();

        if (
          !conversation ||
          (conversation.user1Id !== userId && conversation.user2Id !== userId)
        ) {
          socket.emit("call:error", {
            message: "You are not authorized to call in this conversation.",
          });
          return;
        }

        if (conversation.status !== "ACTIVE") {
          socket.emit("call:error", {
            message: "Only active conversations can start calls.",
          });
          return;
        }

        const receiverId =
          conversation.user1Id === userId
            ? conversation.user2Id
            : conversation.user1Id;

        pendingCalls.set(conversationId, {
          conversationId,
          callerId: userId,
          receiverId,
          callType,
        });    

        io.to(`user:${receiverId}`).emit("call:incoming", {
          conversationId,
          callerId: userId,
          callType,
        });
      } catch (error) {
        console.error("Call invitation failed:", error);

        socket.emit("call:error", {
          message: "Unable to send call invitation.",
        });
      }
    },
  );


  socket.on("call:accept", async (data: { conversationId: string }) => {
    const { conversationId } = data;

    if (!conversationId) {
      socket.emit("call:error", {
        message: "Conversation ID is required.",
      });
      return;
    }

    const pendingCall = pendingCalls.get(conversationId);

    if (!pendingCall || pendingCall.receiverId !== userId) {
      socket.emit("call:error", {
        message: "No valid incoming call found.",
      });
      return;
    }

    const conversation = await db.orm.public.Conversation.where({
      id: conversationId,
    }).first();

    if (
      !conversation ||
      conversation.status !== "ACTIVE" ||
      (conversation.user1Id !== userId && conversation.user2Id !== userId)
    ) {
      pendingCalls.delete(conversationId);

      socket.emit("call:error", {
        message: "This conversation is no longer available.",
      });
      return;
    }

    pendingCalls.delete(conversationId);

    const acceptedData = {
      conversationId,
      acceptedBy: userId,
      callType: pendingCall.callType,
    };

    // Notify the caller
    io.to(`user:${pendingCall.callerId}`).emit("call:accepted", acceptedData);

    // Confirm acceptance to the recipient
    socket.emit("call:accepted", acceptedData);
  });




socket.on("call:reject", async (data: { conversationId: string }) => {
  const { conversationId } = data;

  if (!conversationId) {
    socket.emit("call:error", {
      message: "Conversation ID is required.",
    });
    return;
  }

  const pendingCall = pendingCalls.get(conversationId);

  if (!pendingCall || pendingCall.receiverId !== userId) {
    socket.emit("call:error", {
      message: "No valid incoming call found.",
    });
    return;
  }

  const conversation = await db.orm.public.Conversation.where({
    id: conversationId,
  }).first();

  if (
    !conversation ||
    conversation.status !== "ACTIVE" ||
    (conversation.user1Id !== userId && conversation.user2Id !== userId)
  ) {
    pendingCalls.delete(conversationId);

    socket.emit("call:error", {
      message: "This conversation is no longer available.",
    });
    return;
  }

  pendingCalls.delete(conversationId);

  io.to(`user:${pendingCall.callerId}`).emit("call:rejected", {
    conversationId,
    rejectedBy: userId,
    callType: pendingCall.callType,
  });
});

};


