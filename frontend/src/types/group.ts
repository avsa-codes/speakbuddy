export type Group = {
  id: string;
  topicId: string;
  maxParticipants: number;
  status: string;
  scheduledStartAt: string;
  participantCount: number;
  topic: {
    id: string;
    title: string;
    description: string;
  };
};
