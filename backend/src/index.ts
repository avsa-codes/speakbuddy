import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import topicRoutes from "./routes/topic.routes.js"
import conversationRoutes from "./routes/conversation.routes.js";
import ratingRoutes from "./routes/rating.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middlware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use("/api", topicRoutes);
app.use("/api", conversationRoutes);
app.use("/api", ratingRoutes);
app.use("/api", adminRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SpeakBuddy API is running" });
});


// Start server
app.listen(PORT, () => {
  console.log(`SpeakBuddy API running on port ${PORT}`);
});
