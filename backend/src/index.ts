import express from "express";
import { createSocketServer } from "./socket/socket.server.js";
import { createServer } from "node:http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { createGroupDiscussionRouter } from "./routes/groupDiscussion.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Core Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Server & Socket setup
const httpServer = createServer(app);

const io = createSocketServer(httpServer);

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", topicRoutes);
app.use("/api", conversationRoutes);
app.use("/api", ratingRoutes);
app.use("/api", adminRoutes);

app.use("/api/group-discussions", createGroupDiscussionRouter(io));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "SpeakBuddy API is running",
  });
});

// 4. Error Handling Middleware
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`SpeakBuddy API running on port ${PORT}`);
});
