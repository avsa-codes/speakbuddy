export type LanguageProficiency =
  | "BEGINNER"
  | "ELEMENTARY"
  | "INTERMEDIATE"
  | "UPPER_INTERMEDIATE"
  | "ADVANCED"
  | "PROFICIENT";

const waitingUsers = new Map<
  string,
  {
    userId: string;
    socketId: string;
    topicId: string;
    interests: readonly string[] | null;
    languageProficiency: LanguageProficiency | null;
  }
>();

export default waitingUsers;
