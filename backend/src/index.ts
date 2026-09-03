import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middlware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "SpeakBuddy API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`SpeakBuddy API running on port ${PORT}`);
});
