import express from "express";
import searchRoute from "./search";
const app = express();
const PORT = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/", (req, res) => {
  res.send("Hello, Express.js!");
});
app.use("/", searchRoute);
app.get("/stream-text", async (req, res) => {
  // Set headers for plain text streaming
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Handle client disconnects
  req.on("close", () => {
    console.log("Client disconnected");
  });

  for (let i = 0; i < 5; i++) {
    const chunk = `Chunk ${i}: Data arrived at ${new Date().toLocaleTimeString()}\\n`;
    res.write(chunk); // Write a chunk to the response
    await sleep(1000);
  }

  res.end(); // Ends the response
});

app.get("/event-stream", async (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const statuses = [
    "Connecting to database...",
    "Reading migration files...",
    "Running migration 001...",
    "Running migration 002...",
    "Migration completed successfully!",
  ];

  for (const status of statuses) {
    res.write(`data: ${status}\n\n`);
    await sleep(1000);
  }
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
