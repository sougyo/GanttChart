# CLAUDE.md — GanttChart Project Guidelines

## Security Policy (Highest Priority)

**This application must never send user data to external servers.**
All chart data, task content, and personal information entered by the user stays in the browser only.

### Prohibited implementations

The following are strictly forbidden regardless of the reason or feature request:

- `fetch()` / `XMLHttpRequest` calls that **send** data (POST, PUT, DELETE, PATCH, or any request with a `body` option)
- `WebSocket` connections
- `navigator.sendBeacon()`
- Loading external scripts: `<script src="https://...">` or any CDN
- Loading external stylesheets: `<link href="https://...">`
- Embedding external iframes or images that phone home
- Hardcoding third-party API endpoints
- Dynamic `import()` from external URLs
- Cookies, fingerprinting, or any user-tracking technique

The GitHub Actions workflow (`.github/workflows/security-check.yml`) enforces these rules automatically via static analysis on every push and pull request. **Do not disable or weaken those checks.**

### Allowed network access

The only permitted network access is the existing `fetch(urlParam)` call, which:
- Performs a **GET** request only (no data sent)
- Targets a URL explicitly provided by the user via `?url=` query parameter
- Is used solely to import a JSON file that the user has chosen to load

Do not add new `fetch()` calls beyond this pattern without explicit security justification.

---

## Architecture

- **Single file:** All HTML, CSS, and JavaScript must remain in `index.html`. No build step, no bundler, no external dependencies.
- **Vanilla JS only:** No frameworks (React, Vue, etc.), no npm packages.
- **Persistence:** All data is stored in `localStorage` or exported as JSON by the user. Nothing is persisted on a server.

## Code Style

- Match the existing indentation and naming conventions in `index.html`.
- Keep all UI strings in the `I18N` object and access them via `t(key)`.
- When adding new state that must survive export/import, update three places: the `state` initial definition, `exportJSON()`, and `loadJSONFile()`.

## Testing

Run the security check before committing:

```bash
node tests/security-check.js
```

All 13 checks must pass.
