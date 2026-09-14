import jwt from "jsonwebtoken";

export const adminLoginToken = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    throw new Error("INVALID_ADMIN_CREDENTIALS");
  }

  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};
