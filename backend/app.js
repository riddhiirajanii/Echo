require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const chatRoutes = require("./src/api/routes/chat.routes");
app.use("/api/chat", chatRoutes);

const journalRoutes = require("./src/api/routes/journal.routes");
app.use("/api/journal", journalRoutes);

const assessmentRoutes = require("./src/api/routes/assessment.routes");
app.use("/api/assessment", assessmentRoutes);

const insightsRoutes = require("./src/api/routes/insights.routes");
app.use("/api/insights", insightsRoutes);

const authRoutes = require("./src/api/routes/auth.routes");
app.use("/api/auth", authRoutes);

const profileRoutes = require("./src/api/routes/profile.routes");
app.use( "/api/profile", profileRoutes);

const conversationRoutes = require("./src/api/routes/conversation.routes");
app.use("/api/conversations", conversationRoutes);

const mlRoutes = require("./src/api/routes/ml.routes");
app.use("/api/ml", mlRoutes);

module.exports = app;