const express = require("express");
const { WebhookClient } = require("dialogflow-fulfillment");
const intentMap = require("../intents");

const router = express.Router();

router.post("/", async (req, res) => {
  // 1. Validasi Request
  if (!req.body || !req.body.queryResult) {
    console.error("Invalid request format:", req.body);
    return res.status(400).json({ error: "Invalid request format" });
  }

  // 2. Workaround platform
  if (req.body.queryResult.fulfillmentMessages) {
    req.body.queryResult.fulfillmentMessages =
      req.body.queryResult.fulfillmentMessages.map((m) => {
        if (!m.platform) m.platform = "PLATFORM_UNSPECIFIED";
        return m;
      });
  }

  // 3. Setup agent
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  // 4. Logging
  console.log(
    `[${new Date().toISOString()}] Intent:`,
    req.body.queryResult.intent.displayName
  );

  try {
    // 5. Handle intent
    await agent.handleRequest(intentMap);

    // 6. Log success
    console.debug(
      `[SUCCESS] Intent handled:`,
      req.body.queryResult.intent.displayName
    );
  } catch (error) {
    // 7. Enhanced error handling
    console.error(`[ERROR] Intent handling failed:`, {
      intent: req.body.queryResult.intent.displayName,
      error: error.message,
      stack: error.stack,
    });

    if (error.message.includes("map of Dialogflow intent names")) {
      return res.status(400).json({
        error: "Intent handler misconfiguration",
        details: "Check your intentMap exports",
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      requestId: req.headers["x-request-id"] || "none",
    });
  }
});

module.exports = router;
