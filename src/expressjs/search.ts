import express from "express";
import { fetchAds, fetchFilters, fetchSearchResults } from "./mock-data";

const router = express.Router();

const footer = `
      <footer class="bg-dark text-white mt-5 py-4">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-4 mb-3 mb-md-0">
              <h5>About</h5>
              <p class="small ">A high-performance search engine built with Express.js and streaming responses for optimal user experience.</p>
            </div>
            <div class="col-md-4 mb-3 mb-md-0">
              <h5>Quick Links</h5>
              <ul class="list-unstyled">
                <li><a href="#" class=" text-decoration-none">Home</a></li>
                <li><a href="#" class=" text-decoration-none">Privacy Policy</a></li>
                <li><a href="#" class=" text-decoration-none">Terms of Service</a></li>
                <li><a href="#" class=" text-decoration-none">Contact</a></li>
              </ul>
            </div>
            <div class="col-md-4">
              <h5>Connect</h5>
              <div class="d-flex gap-3">
                <a href="#" class=""><i class="bi bi-twitter"></i> Twitter</a>
                <a href="#" class=""><i class="bi bi-github"></i> GitHub</a>
                <a href="#" class=""><i class="bi bi-linkedin"></i> LinkedIn</a>
              </div>
            </div>
          </div>
          <hr class="bg-secondary">
          <div class="text-center text-muted small">
            <p class="mb-0">&copy; 2025 Search Engine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </body>
    </html>
  `;

router.get("/search", async (req, res) => {
  // Set headers for streaming
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  // 1. Flush head immediately
  res.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>In-order flushing - Search Results</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    </head>
    <body class="bg-light">
      <header class="navbar navbar-dark bg-primary shadow-sm mb-4">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">🔍 Search Engine</span>
        </div>
      </header>
      <div class="container-fluid">
        <div class="row">
  `);

  // Start async operations
  const resultsPromise = fetchSearchResults();
  const adsPromise = fetchAds();
  const filtersPromise = fetchFilters();

  // 2. Wait and flush in order
  const results = await resultsPromise;
  res.write(`
          <main class="col-lg-6 col-md-8 order-2 order-md-1">
            <h2 class="mb-4">Search Results</h2>
            ${results
              .map(
                (item) => `
              <div class="card mb-3 shadow-sm">
                <div class="card-body">
                  <h5 class="card-title text-primary">${item.title}</h5>
                  <p class="card-text text-muted">${item.description}</p>
                  <a href="${item.url}" class="btn btn-sm btn-outline-primary">Visit Site</a>
                </div>
              </div>
            `
              )
              .join("")}
          </main>
  `);

  const filters = await filtersPromise;
  res.write(`
          <aside class="col-lg-3 col-md-4 order-1 order-md-2">
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-white">
                <h5 class="mb-0">Filters</h5>
              </div>
              <div class="card-body">
                ${filters
                  .map(
                    (filter) => `
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="checkbox" id="${filter.id}">
                    <label class="form-check-label" for="${filter.id}">
                      ${filter.name} <span class="badge bg-secondary">${filter.count}</span>
                    </label>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </aside>
  `);

  const ads = await adsPromise;
  res.write(`
          <aside class="col-lg-3 col-md-12 order-3">
            <div class="sticky-top" style="top: 20px;">
              <h5 class="mb-3">Sponsored</h5>
              ${ads
                .map(
                  (ad) => `
                <div class="card mb-3 shadow-sm border-warning">
                  <div class="card-body">
                    <h6 class="card-title">${ad.title}</h6>
                    <p class="card-text small">${ad.content}</p>
                    <a href="${ad.url}" class="btn btn-sm btn-warning">Learn More</a>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </aside>
        </div>
      </div>
  `);

  // 3. Close the HTML
  res.write(footer);

  res.end();
});

router.get("/search-out-of-order", async (req, res) => {
  // Set headers for streaming
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  // Flush head immediately
  res.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Out-of-order flushing - Search Results</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
      <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
      <style>
        @keyframes skeleton-loading {
          0% { background-color: #e0e0e0; }
          50% { background-color: #f0f0f0; }
          100% { background-color: #e0e0e0; }
        }
        .skeleton {
          animation: skeleton-loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }
        .skeleton-title { height: 24px; margin-bottom: 12px; }
        .skeleton-text { height: 16px; margin-bottom: 8px; }
        .skeleton-button { height: 32px; width: 100px; }
      </style>
    </head>
    <body class="bg-light">
      <header class="navbar navbar-dark bg-success shadow-sm mb-4">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">⚡ Search Engine (Out-of-order)</span>
        </div>
      </header>
      <div class="container-fluid">
        <div class="row">
          <main class="col-lg-6 col-md-8 order-2 order-md-1">
            <h2 class="mb-4">Search Results</h2>
            <div id="results-placeholder">
              ${[1, 2, 3, 4]
                .map(
                  () => `
                <div class="card mb-3 shadow-sm">
                  <div class="card-body">
                    <div class="skeleton skeleton-title" style="width: 80%;"></div>
                    <div class="skeleton skeleton-text" style="width: 100%;"></div>
                    <div class="skeleton skeleton-text" style="width: 90%;"></div>
                    <div class="skeleton skeleton-button mt-2"></div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </main>
          
          <aside class="col-lg-3 col-md-4 order-1 order-md-2">
            <div id="filters-placeholder">
              <div class="card shadow-sm mb-4">
                <div class="card-header bg-white">
                  <h5 class="mb-0">Filters</h5>
                </div>
                <div class="card-body">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      () => `
                    <div class="mb-2">
                      <div class="skeleton skeleton-text" style="width: 70%;"></div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </aside>
          
          <aside class="col-lg-3 col-md-12 order-3">
            <div class="sticky-top" style="top: 20px;">
              <h5 class="mb-3">Sponsored</h5>
              <div id="ads-placeholder">
                ${[1, 2]
                  .map(
                    () => `
                  <div class="card mb-3 shadow-sm border-warning">
                    <div class="card-body">
                      <div class="skeleton skeleton-title" style="width: 70%;"></div>
                      <div class="skeleton skeleton-text" style="width: 100%;"></div>
                      <div class="skeleton skeleton-text" style="width: 85%;"></div>
                      <div class="skeleton skeleton-button mt-2"></div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </aside>
        </div>
      </div>
      <script>
        // Simple function to replace placeholder with content
        function replacePlaceholder(id, html) {
          const placeholder = document.getElementById(id + '-placeholder');
          const temp = document.createElement('div');
          temp.innerHTML = html;
          placeholder.replaceWith(...temp.childNodes);
        }
      </script>
    ${footer}
  `);

  const operations = [
    { id: "results", promise: fetchSearchResults() },
    { id: "filters", promise: fetchFilters() },
    { id: "ads", promise: fetchAds() },
  ];

  // 3. Flush each fragment as soon as it completes (out of order!)
  await Promise.all(
    operations.map(async (op) => {
      const data = await op.promise;
      const html = renderFragment(op.id, data);

      // Send immediately when ready - no waiting!
      res.write(`
        <script>
          replacePlaceholder('${op.id}', ${JSON.stringify(html)});
        </script>
      `);
    })
  );

  res.end();
});

function renderFragment(id, data) {
  if (id === "results") {
    return data
      .map(
        (item) => `
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-primary">${item.title}</h5>
          <p class="card-text text-muted">${item.description}</p>
          <a href="${item.url}" class="btn btn-sm btn-outline-primary">Visit Site</a>
        </div>
      </div>
    `
      )
      .join("");
  }
  if (id === "filters") {
    return `
      <div class="card shadow-sm mb-4">
        <div class="card-header bg-white">
          <h5 class="mb-0">Filters</h5>
        </div>
        <div class="card-body">
          ${data
            .map(
              (filter) => `
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox" id="${filter.id}">
              <label class="form-check-label" for="${filter.id}">
                ${filter.name} <span class="badge bg-secondary">${filter.count}</span>
              </label>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  if (id === "ads") {
    return data
      .map(
        (ad) => `
      <div class="card mb-3 shadow-sm border-warning">
        <div class="card-body">
          <h6 class="card-title">${ad.title}</h6>
          <p class="card-text small">${ad.content}</p>
          <a href="${ad.url}" class="btn btn-sm btn-warning">Learn More</a>
        </div>
      </div>
    `
      )
      .join("");
  }
}

export default router;
