import http from "node:http";
import { sleep } from "../sleep";

const statuses = [
  "Connecting to database...",
  "Reading migration files...",
  "Running migration 001...",
  "Running migration 002...",
  "Migration completed successfully!",
];

// Create a local server to receive data from
const server = http.createServer(async (req, res) => {
  const url = req.url;

  if (url === "/stream-text") {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
      "X-Content-Type-Options": "nosniff",
    });

    for (const status of statuses) {
      res.write(`${status}\n`);
      await sleep(1000);
    }
    res.end();
    return;
  }

  if (url === "/event-stream") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    for (const status of statuses) {
      res.write(`data: ${status}\n\n`);
      await sleep(1000);
    }
    res.end();
    return;
  }

  if (url === "/test") {
    // fetch data from another server and stream it
    const response = await fetch("https://dog.ceo/api/breeds/image/random");

    // 1. Stream the fetch response to the client
    // Sends data to client as chunks arrive from upstream server
    // Low memory usage - only one chunk in memory at a time
    // Client starts receiving data immediately (better TTFB)
    // Works for any content type (JSON, images, videos, etc.)
    // Better for large responses or real-time proxying
    // Set headers from the fetch response
    res.writeHead(response.status, {
      "Content-Type":
        response.headers.get("Content-Type") || "application/json",
    });

    // Stream the response body to res
    if (response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    }

    res.end();
    return;

    // 2. Or parse the JSON and send a custom response
    // Waits for entire response to download
    // Parses the complete JSON into memory
    // Then sends everything in one go
    // Only works for JSON
    // Simpler code but higher latency and memory usage
    // const response = await fetch("https://dog.ceo/api/breeds/image/random");
    // const data = await response.json(); // Waits for entire response + parses JSON
    // res.writeHead(200, { "Content-Type": "application/json" });
    // res.end(JSON.stringify(data)); // Sends all at once
    // return;
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
