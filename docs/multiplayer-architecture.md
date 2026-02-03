# Multiplayer Architecture Plan

## Goals
- Add lightweight account system (username + password) to personalize sessions and enable multiplayer matchmaking.
- Provide lobby list and room experience for 1v1 fleet battles with both players controlling ships.
- Keep tech simple enough to run locally (no external auth/email providers) while remaining secure (hashed passwords, session tokens).

## High-Level Components
1. **Auth + Lobby Server (Node.js)**
   - Express REST API for signup/login/profile endpoints.
   - SQLite database (via better-sqlite3 or Prisma) for users, sessions, lobby metadata, and stored fleets.
   - WebSocket (ws or Socket.IO) gateway for lobby updates and real-time battle synchronization.
2. **Game Client (existing front-end)**
   - Profile modal for login/signup.
   - Lobby browser overlay for creating/joining rooms, chat, and ready states.
   - Fleet builder reuse for multiplayer draft, synchronized via WebSocket events.
   - Networked battle loop, mirroring inputs and ship state for both players.

## Data Model Outline
- `users`
  - `id` (uuid)
  - `username` (unique)
  - `password_hash` (bcrypt)
  - `created_at`
- `sessions`
  - `token` (uuid or random string)
  - `user_id`
  - `expires_at`
- `lobbies`
  - `id`
  - `name`
  - `host_id`
  - `guest_id`
  - `status` (open, ready, playing)
  - `created_at`
- `fleets`
  - `id`
  - `user_id`
  - `name`
  - `ships` (JSON array of ship ids)

## REST API Endpoints
- `POST /api/signup` → { username, password } → create user, return session token.
- `POST /api/login` → { username, password } → validate credentials, return token.
- `GET /api/me` → header token → return user profile + saved fleets.
- `POST /api/lobbies` → create lobby (requires auth).
- `GET /api/lobbies` → list open lobbies.
- `POST /api/lobbies/:id/join` → join as guest if slot free.
- `POST /api/lobbies/:id/leave` → leave lobby (host removal closes lobby).
- `POST /api/fleets` → save/update preset fleet (optional first iteration).

## WebSocket Channels / Events
Namespace `/ws` with per-connection auth (token).
- `lobby:update` → server broadcasts lobby roster, ready flags, selected ships, chat.
- `lobby:selectShip` → client picks ship for slot (mirrors UI changes).
- `lobby:ready` → toggle ready state.
- `match:start` → server indicates both players ready; send seed/state to start battle.
- `match:command` → real-time player inputs (thrust, turn, fire, special).
- `match:state` → periodic snapshots for reconciliation.
- `match:end` → final result, return to lobby.

## Client Integration Steps
1. **Profile UI**
   - Modal with username/password fields, Create Account + Login buttons, error display.
   - Store token in memory/localStorage, update HUD with logged-in username.
2. **Lobby Browser**
   - New overlay accessed from main menu (Multiplayer button) listing lobbies.
   - Buttons: Create Lobby (name), Join, Refresh.
   - Lobby room view: both player panels, ready switches, chat log, fleet builder view (shared).
3. **Realtime Sync**
   - Upon joining lobby, open WebSocket with auth token.
   - Mirror fleet builder selections: disable start until both ready and fleets valid.
4. **Battle Networking (later phase)**
   - For first version, send authoritative commands to server and echo back to both clients (lockstep model).
   - Consider deterministic simulation or server-run physics for anti-cheat (future).

## Security / Simplicity Choices
- Use bcrypt with 12 rounds for password hashing.
- Issue opaque session token stored server-side (sessions table) for easy invalidation.
- No email/password reset yet; rely on players remembering usernames.
- Rate-limit signup/login endpoints to avoid abuse (basic middleware).

## Deployment / Dev
- Add `/server` directory with Node project, `npm run server` start script.
- Front-end uses `.env` or config to point to API/WebSocket host (default `http://localhost:4000`).
- Provide scripts:
  - `npm run dev:server` → start backend with nodemon.
  - `npm run dev:client` → existing static server.

## Milestones
1. Auth API + database scaffold.
2. Front-end profile modal hooking into auth endpoints.
3. Lobby REST + WebSocket service (create/join/ready, fleet sync).
4. Networked battle controls.
5. Match history / persistent fleets (optional future).
