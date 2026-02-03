# The Barack Masters Backend

This folder hosts the lightweight multiplayer backend that powers authentication, lobby management, and realtime coordination for fleet battles.

## Prerequisites
- Node.js 18+

## Setup
```bash
cd server
cp .env.example .env   # edit values as needed
npm install
```

## Scripts
- `npm run start` – launch the Express server.
- `npm run dev` – start with `nodemon` for hot reloading.

The API listens on `SERVER_PORT` (default `4000`). WebSockets share the same host using the `/ws?token=...` path.

## API Snapshot
- `POST /api/signup` – create username/password account.
- `POST /api/login` – authenticate and receive session cookie + token.
- `POST /api/logout` – destroy session.
- `GET /api/me` – fetch current profile (requires auth).
- `GET /api/lobbies` – list open lobbies.
- `POST /api/lobbies` – create a new lobby (auth required).
- `POST /api/lobbies/:id/join` – join as guest if slot open.
- `POST /api/lobbies/:id/leave` – leave a lobby (host delete or guest exit).
- `DELETE /api/lobbies/:id` – host-only lobby removal.

## WebSocket Events
Connect to `ws://HOST:PORT/ws?token=<sessionToken>`.
- `lobby:subscribe` – begin receiving updates for a lobby.
- `lobby:setFleet` – sync current ship roster.
- `lobby:setReady` – toggle ready state; server emits `match:start` when both ready.
- `chat:message` – send lobby chat line.
- `match:command` – broadcast in-battle inputs (echoed to both players).

See `docs/multiplayer-architecture.md` for the full roadmap.
