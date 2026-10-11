type PendingCall = {
  conversationId: string;
  callerId: string;
  receiverId: string;
  callType: "audio" | "video";
};

const pendingCalls = new Map<string, PendingCall>();

export default pendingCalls;
