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

  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
  }

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
