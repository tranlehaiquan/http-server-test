const server = Bun.serve({
  // `routes` requires Bun v1.2.3+
  routes: {
    "/": new Response("Hello, Bun Server!"),
    "/stream-text": (req) => {
      const headers = new Headers({
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      });
      const statuses = [
        "Connecting to database...",
        "Reading migration files...",
        "Running migration 001...",
        "Running migration 002...",
        "Migration completed successfully!",
      ];

      const stream = new ReadableStream({
        async start(controller) {
          for (const status of statuses) {
            controller.enqueue(`data: ${status}\n\n`);
            await Bun.sleep(500); // Wait 500ms between messages
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers,
      });
    },
    "/event-stream": (req) => {
      const headers = new Headers({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const statuses = [
        "Connecting to database...",
        "Reading migration files...",
        "Running migration 001...",
        "Running migration 002...",
        "Migration completed successfully!",
      ];

      const stream = new ReadableStream({
        async start(controller) {
          for (const status of statuses) {
            controller.enqueue(`data: ${status}\n\n`);
            await Bun.sleep(1000); // Wait 1 second between messages
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers,
      });
    },
  },

  // (optional) fallback for unmatched routes:
  // Required if Bun's version < 1.2.3
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);
