export const fetchSearchResults = async (): Promise<
  { title: string; description: string; url: string }[]
> => {
  // Simulate async data fetching
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            title: "Advanced TypeScript Patterns for Modern Web Apps",
            description:
              "Explore advanced TypeScript patterns including generics, utility types, and conditional types to build robust applications.",
            url: "#typescript-guide",
          },
          {
            title: "Building High-Performance HTTP Servers with Node.js",
            description:
              "Learn how to create scalable HTTP servers using various Node.js frameworks including Express, Hono, and native HTTP modules.",
            url: "#nodejs-servers",
          },
          {
            title: "Streaming Responses in Express.js",
            description:
              "Master the art of streaming responses to improve perceived performance and user experience in your Express applications.",
            url: "#express-streaming",
          },
          {
            title: "Bootstrap 5 Complete Guide",
            description:
              "Comprehensive guide to Bootstrap 5 components, utilities, and layout system for responsive web design.",
            url: "#bootstrap-guide",
          },
        ]),
      1000
    )
  );
};

export const fetchAds = async (): Promise<
  { title: string; content: string; url: string }[]
> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            title: "Premium Cloud Hosting",
            content:
              "Get 50% off your first year. Fast, reliable, and secure hosting for your applications.",
            url: "#cloud-hosting",
          },
          {
            title: "AI Code Assistant Pro",
            content:
              "Boost your productivity with AI-powered code completion and debugging tools.",
            url: "#ai-assistant",
          },
        ]),
      1500
    )
  );
};

export const fetchFilters = async (): Promise<
  { id: string; name: string; count: number }[]
> => {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: "filter-typescript", name: "TypeScript", count: 42 },
          { id: "filter-nodejs", name: "Node.js", count: 38 },
          { id: "filter-express", name: "Express.js", count: 25 },
          { id: "filter-bootstrap", name: "Bootstrap", count: 18 },
          { id: "filter-streaming", name: "Streaming", count: 12 },
        ]),
      500
    )
  );
};
