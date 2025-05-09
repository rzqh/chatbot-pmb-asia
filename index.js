require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { initializeDatabase } = require("./src/config/database");
const webhookRouter = require("./routes/webhook");

const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/webhook", webhookRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Database and application initialization
async function initializeApp() {
  try {
    console.log("🔧 Initializing application...");

    // Initialize database and run migrations
    await initializeDatabase();

    console.log("✅ Application initialized successfully");
  } catch (error) {
    console.error("❌ Application initialization failed:", error);
    throw error;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Application error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// Start server
async function startServer() {
  try {
    await initializeApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("🛑 Failed to start server:", error);
    process.exit(1);
  }
}

// Process event handlers
function setupProcessHandlers() {
  process.on("unhandledRejection", (reason, promise) => {
    console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught Exception:", error);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    console.log("🛑 Received SIGTERM. Shutting down gracefully...");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("🛑 Received SIGINT. Shutting down gracefully...");
    process.exit(0);
  });
}

// Main function
async function main() {
  setupProcessHandlers();
  await startServer();
}

// Start the application
main().catch((error) => {
  console.error("🛑 Fatal error during startup:", error);
  process.exit(1);
});
