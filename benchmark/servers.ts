export const SERVERS = [
  {
    name: "node-http",
    command: "ts-node",
    args: ["src/node-http/index.ts"],
    port: 3000,
  },
  {
    name: "bun-server",
    command: "bun",
    args: ["src/bun-server/index.ts"],
    port: 3001,
  },
  {
    name: "express",
    command: "ts-node",
    args: ["src/expressjs/index.ts"],
    port: 3002,
  },
  {
    name: "hono",
    command: "bun",
    args: ["src/hono/index.ts"],
    port: 3003,
  },
  {
    name: "elysia",
    command: "bun",
    args: ["src/elysiajs/index.ts"],
    port: 3004,
  },
];
