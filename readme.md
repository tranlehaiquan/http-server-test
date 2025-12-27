# http-server-test

A pet project exploring different HTTP server implementations in Node.js and Bun, featuring streaming, event-stream, and proxy examples.

## Server Implementations

- **Express.js** - Traditional Express server
- **Hono** - Lightweight web framework
- **Node HTTP** - Native Node.js http module with streaming
- **Bun Server** - Native Bun server with Web APIs

## Features

- Text streaming with chunked transfer encoding
- Server-Sent Events (SSE) implementation
- Response proxying and streaming from external APIs
- Performance comparison between frameworks

## Quick Start

```bash
pnpm install

# Run different servers
pnpm dev:express
pnpm dev:hono
```
