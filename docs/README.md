# Project Documentation

## Overview

Ekzamen is a small browser multiplayer game. A player logs in with a nickname, receives a JWT token, connects to the Socket.IO server, moves around a simple 3D world, and can send chat messages to all connected players.

The project has two main parts:

- Server: Fastify app with REST routes, PostgreSQL persistence, JWT auth, and Socket.IO game synchronization.
- Client: Vite-powered browser app with Three.js rendering, keyboard input, chat UI, and Socket.IO networking.

## Tech Stack

- Node.js with ES modules
- Fastify for HTTP routes and static hosting
- Socket.IO for realtime game and chat events
- PostgreSQL through `pg`
- JSON Web Tokens through `jsonwebtoken`
- Vite for client development/build
- Three.js for client rendering

## Project Structure

```text
.
├── game/                 # Browser client
│   ├── core/             # Input, scaling, player manager
│   ├── entities/         # Rendered game entities
│   ├── graphics/         # Three.js scene, renderer, camera, labels, resize
│   ├── network/          # REST auth and Socket.IO client
│   ├── ui/               # Login, chat, notifications
│   └── world/            # Game composition and world setup
├── shared/               # Shared constants and movement logic
├── src/                  # Server code
│   ├── db/               # PostgreSQL connection, setup, repositories
│   ├── helpers/          # JWT helper
│   ├── routes/           # Fastify HTTP routes
│   ├── socket/           # Socket.IO auth, state, loop, handlers
│   └── validators/       # Input validation
├── index.html            # Client HTML shell
├── server.js             # Production server entry point
├── package.json          # Scripts and dependencies
└── render.yaml           # Render deployment config
```

## Environment Variables

Create a `.env` file using `.env.example` as a template:

```env
PORT=3000
HOST=0.0.0.0
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
JWT_SECRET=your_jwt_secret
```

Variables:

- `PORT`: HTTP server port.
- `HOST`: HTTP server host. Use `0.0.0.0` for deployment.
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: secret used to sign and verify player tokens.

## Installation

```bash
npm install
```

## Development

Run the Vite development server:

```bash
npm run dev
```

The development script serves the frontend through Vite. Backend features such as `/auth/login`, Socket.IO, and PostgreSQL persistence require the Node server to be running as well or a Vite proxy to be configured.

## Production Build and Start

Build the frontend:

```bash
npm run build
```

Start the Fastify server:

```bash
npm start
```

In production, `server.js` serves files from `dist`, registers HTTP routes, connects to PostgreSQL, initializes database tables, starts listening, and attaches Socket.IO to the HTTP server.

## HTTP API

### `GET /ping`

Health-check route.

Response:

```text
pong
```

### `POST /auth/login`

Creates or finds a player by nickname and returns a JWT token.

Request:

```json
{
  "nickname": "player123"
}
```

Success response:

```json
{
  "token": "jwt-token",
  "nickname": "player123"
}
```

Validation rules:

- `nickname` must be a string.
- Leading and trailing spaces are removed.
- Length must be from 3 to 20 characters.

Possible errors:

- `400 INVALID_NICKNAME`
- `500 AUTH_INTERNAL_ERROR`

## Socket.IO Authentication

The client connects with a token returned by `/auth/login`:

```js
io({
  auth: { token }
});
```

The server verifies the token and attaches the player id and nickname to the socket. If the same player connects again, the previous socket is disconnected.

## Socket.IO Events

### Server to client: `init`

Sent after a successful connection.

Payload:

```json
{
  "selfId": 1,
  "players": {},
  "chat": []
}
```

### Client to server: `player:input`

Sent repeatedly by the client to update movement intent.

Payload:

```json
{
  "up": false,
  "down": false,
  "left": false,
  "right": true
}
```

### Server to client: `world:update`

Broadcast on each game tick.

Payload:

```json
{
  "players": {}
}
```

### Server to client: `player:joined`

Broadcast when a new player enters the world.

### Server to client: `player:left`

Broadcast when a player disconnects. The payload is the player id.

### Client to server: `chat:message`

Sends a chat message.

Payload:

```text
hello
```

Validation rules:

- Message must be a string.
- Empty messages are rejected.
- Maximum length is 200 characters.

### Server to client: `chat:message`

Broadcast when a message is saved and accepted.

Payload:

```json
{
  "nickname": "player123",
  "text": "hello",
  "created_at": "2026-06-21T20:00:00.000Z"
}
```

### Server to client: `chat:error`

Sent to the current socket when chat validation or persistence fails.

## Game Loop

The server runs a fixed tick loop with:

- `TICK_RATE = 20`
- `TICK_MS = 1000 / TICK_RATE`

On every tick the server applies movement from the latest input state and broadcasts the full player state through `world:update`.

Movement constants:

- `WORLD_SIZE = 15`
- `PLAYER_SPEED = 7`

Player position is clamped to the world bounds.

## Database

Tables are created automatically on server startup.

### `players`

Stores unique player nicknames.

Columns:

- `id`
- `nickname`
- `created_at`

### `messages`

Stores chat history.

Columns:

- `id`
- `nickname`
- `text`
- `created_at`

On connection, the server loads the last 25 chat messages ordered from oldest to newest.

## Client Flow

1. `index.html` loads `/game/main.js`.
2. `main.js` creates the game and login view.
3. The user enters a nickname and clicks login.
4. `loginRequest` calls `POST /auth/login`.
5. The returned token is passed to `game.connect(token)`.
6. Socket.IO connects with JWT auth.
7. The client receives `init`, renders players, loads chat history, and starts sending input every 50 ms.
8. The render loop interpolates player positions and draws the Three.js scene.

## Deployment Notes

`render.yaml` defines a Render web service:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Required secret environment variables: `DATABASE_URL`, `JWT_SECRET`

Make sure the deployment database accepts SSL connections, because the current `pg` pool config enables SSL with `rejectUnauthorized: false`.

## Known Limitations

- There is no test suite yet.
- Development mode is incomplete unless the backend is also available to the frontend.
- Chat history stores nicknames as text instead of referencing `players.id`.
- The entire player state is broadcast every tick, which is simple but may not scale well.
- Socket CORS is currently open to all origins.

## Link 

https://multiplayer-8mbh.onrender.com
