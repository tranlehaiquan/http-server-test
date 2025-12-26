import { Hono } from "hono";
import { streamText, streamSSE, stream } from "hono/streaming";
import { serve } from "@hono/node-server";
import { sleep } from "../sleep";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, Hono with Streaming!");
});

app.get("/stream", (c) => {
  return stream(c, async (stream) => {
    // Write a process to be executed when aborted.
    stream.onAbort(() => {
      console.log("Aborted!");
    });
    // Write a Uint8Array.
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]));
    // Write a string.
    await stream.write(", Hono! 1");
    // Write a Blob.
    await stream.close();
  });
});

app.get("/stream-text", (c) => {
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    await stream.writeln("Hello");
    for (let i = 0; i < 50; i++) {
      // Wait 1 second.
      await sleep(1000);
      // Write a text without a new line.
      await stream.write(`Hono!`);
    }
  });
});

app.get("/event-stream", (c) => {
  return streamSSE(c, async (stream) => {
    const statuses = [
      "Connecting to database...",
      "Reading migration files...",
      "Running migration 001...",
      "Running migration 002...",
      "Migration completed successfully!",
    ];

    for (const status of statuses) {
      await stream.writeSSE({ data: status });
      await sleep(1000);
    }
  });
});

const server = serve(app);
console.log("Hono server is running on http://localhost:3000");

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
