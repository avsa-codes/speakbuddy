export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  bio: string | null;
  interests: string[];
  languageProficiency: string;
  rating: number;
  totalRatings: number;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};
