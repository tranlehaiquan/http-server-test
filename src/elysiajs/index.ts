import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .listen(3004, () => {
    console.log("Elysia server is running on http://localhost:3004");
  });
