# Suggested Issues

This file contains invented issues that could reasonably exist in the project backlog.

## High Priority

### 1. Configure local development for frontend + backend

Problem: `npm run dev` starts Vite only, while the client expects `/auth/login` and Socket.IO to be available on the same origin.

Expected result:

- Add a documented local development flow.
- Either run backend and frontend together or configure Vite proxying.
- Update documentation with exact local URLs.

Suggested labels: `dev-experience`, `backend`, `frontend`

### 2. Validate required environment variables on startup

Problem: `PORT`, `HOST`, `DATABASE_URL`, and `JWT_SECRET` are converted with `Number()` or `String()` without checking whether they are actually present. Missing variables can produce confusing runtime behavior.

Expected result:

- Fail fast with clear errors when required variables are missing.
- Validate that `PORT` is a valid number.
- Avoid starting the server with an invalid JWT secret or database URL.

Suggested labels: `backend`, `configuration`, `reliability`

### 3. Restrict Socket.IO CORS in production

Problem: Socket.IO currently uses `origin: "*"`, which allows any origin to connect.

Expected result:

- Add an `ALLOWED_ORIGINS` environment variable.
- Use strict origins in production.
- Keep a simple default for local development.

Suggested labels: `security`, `backend`

### 4. Add automated tests for validators and movement

Problem: Core behavior such as nickname validation, message validation, and movement clamping is not covered by tests.

Expected result:

- Add a test runner.
- Cover `validateNickname`, `validateMessage`, and `applyMovement`.
- Add test script to `package.json`.

Suggested labels: `testing`, `quality`

## Medium Priority

### 5. Improve duplicate nickname handling during concurrent login

Problem: Two simultaneous login requests for the same new nickname can both try to insert a player and one may fail due to the unique constraint.

Expected result:

- Handle unique constraint races gracefully.
- Return the existing player when another request created it first.
- Keep the response format unchanged.

Suggested labels: `backend`, `database`, `bug`

### 6. Store chat messages by player id

Problem: The `messages` table stores only the nickname text. If player records change later, message ownership will be harder to track.

Expected result:

- Add `player_id` to `messages`.
- Keep nickname display available in chat payloads.
- Add a migration or startup-safe schema update.

Suggested labels: `database`, `chat`

### 7. Add rate limiting for auth and chat

Problem: Login and chat endpoints can be spammed by a client.

Expected result:

- Rate-limit `/auth/login`.
- Throttle `chat:message` per socket/player.
- Return useful errors to the client.

Suggested labels: `security`, `backend`, `chat`

### 8. Add client reconnect state handling

Problem: The client does not show a clear state when Socket.IO disconnects or reconnects.

Expected result:

- Show notifications for disconnected/reconnected states.
- Avoid sending input while disconnected.
- Keep chat input behavior predictable during reconnect.

Suggested labels: `frontend`, `realtime`, `ux`

### 9. Make player colors stable

Problem: Player colors are randomly generated on each connection, so a player may change color after reconnecting.

Expected result:

- Generate colors deterministically from player id or nickname.
- Keep colors valid six-digit hex values.
- Document color behavior.

Suggested labels: `frontend`, `gameplay`, `polish`

### 10. Optimize `world:update` payloads

Problem: The server broadcasts the full `players` object 20 times per second. This is fine for a small demo, but inefficient as the number of players grows.

Expected result:

- Measure current payload size.
- Consider sending only changed positions/inputs.
- Keep client interpolation working.

Suggested labels: `performance`, `realtime`

## Low Priority

### 11. Add chat timestamps formatting option

Problem: Chat timestamps are formatted with the browser locale only. This may make screenshots or tests inconsistent.

Expected result:

- Use a consistent display format or configurable locale.
- Keep the raw ISO timestamp in server payloads.

Suggested labels: `frontend`, `chat`, `polish`

### 12. Add accessibility labels to login and chat controls

Problem: The HTML has empty `<label>` elements for nickname and message inputs.

Expected result:

- Add meaningful labels or `aria-label` attributes.
- Preserve the current compact UI.

Suggested labels: `accessibility`, `frontend`

### 13. Add graceful shutdown for database and server

Problem: The server does not close the PostgreSQL pool or Fastify instance on process shutdown.

Expected result:

- Handle `SIGINT` and `SIGTERM`.
- Close Fastify and database connections cleanly.
- Log shutdown steps.

Suggested labels: `backend`, `reliability`

### 14. Add a simple player count UI

Problem: Users cannot see how many players are online.

Expected result:

- Show current online player count in the UI.
- Update it on `init`, `player:joined`, and `player:left`.

Suggested labels: `frontend`, `ux`

### 15. Document Render database setup

Problem: `render.yaml` references `DATABASE_URL`, but the docs do not explain how to create and connect the database provider.

Expected result:

- Add deployment steps for creating a PostgreSQL database.
- Explain where to set `DATABASE_URL` and `JWT_SECRET`.
- Mention SSL expectations.

Suggested labels: `documentation`, `deployment`
