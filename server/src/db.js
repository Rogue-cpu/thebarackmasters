const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { v4: uuid } = require('uuid');
const { DB_PATH, SESSION_TTL_MS } = require('./config');
const logger = require('./services/logger');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lobbies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  host_id TEXT NOT NULL,
  guest_id TEXT,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(host_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(guest_id) REFERENCES users(id) ON DELETE SET NULL
);
`);

function toSafeUser(row){
  if(!row) return null;
  return { id: row.id, username: row.username, createdAt: row.created_at };
}

function createUser(username, passwordHash){
  const user = { id: uuid(), username, password_hash: passwordHash, created_at: Date.now() };
  try{
    db.prepare(`INSERT INTO users (id, username, password_hash, created_at) VALUES (@id, @username, @password_hash, @created_at)`).run(user);
    return toSafeUser(user);
  }catch(err){
    if(err.code === 'SQLITE_CONSTRAINT_UNIQUE') return null;
    throw err;
  }
}

function getUserByUsername(username){
  return db.prepare(`SELECT * FROM users WHERE username = ?`).get(username);
}

function getUserById(id){
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
  return toSafeUser(row);
}

function createSession(userId){
  const session = {
    token: uuid(),
    user_id: userId,
    expires_at: Date.now() + SESSION_TTL_MS,
    created_at: Date.now()
  };
  db.prepare(`INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (@token, @user_id, @expires_at, @created_at)`).run(session);
  return session;
}

function getSession(token){
  if(!token) return null;
  return db.prepare(`SELECT * FROM sessions WHERE token = ?`).get(token);
}

function deleteSession(token){
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}

function pruneExpiredSessions(){
  const count = db.prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(Date.now());
  if(count.changes) logger.debug({ removed: count.changes }, 'pruned sessions');
}

function upsertLobby({ name, hostId }){
  const lobby = {
    id: uuid(),
    name: name || 'Untitled Lobby',
    host_id: hostId,
    guest_id: null,
    status: 'open',
    created_at: Date.now()
  };
  db.prepare(`INSERT INTO lobbies (id, name, host_id, guest_id, status, created_at) VALUES (@id, @name, @host_id, @guest_id, @status, @created_at)`).run(lobby);
  return lobby;
}

function listLobbies(){
  const rows = db.prepare(`
    SELECT l.*, h.username AS host_name, g.username AS guest_name
    FROM lobbies l
    LEFT JOIN users h ON h.id = l.host_id
    LEFT JOIN users g ON g.id = l.guest_id
    ORDER BY l.created_at DESC
  `).all();
  return rows.map(row=>({
    id: row.id,
    name: row.name,
    status: row.status,
    createdAt: row.created_at,
    host: row.host_name ? { id: row.host_id, username: row.host_name } : null,
    guest: row.guest_name ? { id: row.guest_id, username: row.guest_name } : null
  }));
}

function getLobbyById(id){
  const row = db.prepare(`SELECT * FROM lobbies WHERE id = ?`).get(id);
  if(!row) return null;
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    hostId: row.host_id,
    guestId: row.guest_id,
    createdAt: row.created_at
  };
}

function updateLobbyStatus(id, status){
  db.prepare(`UPDATE lobbies SET status = ? WHERE id = ?`).run(status, id);
}

function joinLobby(lobbyId, userId){
  const lobby = db.prepare(`SELECT * FROM lobbies WHERE id = ?`).get(lobbyId);
  if(!lobby) return { error: 'NOT_FOUND' };
  if(lobby.host_id === userId || lobby.guest_id === userId){
    return { lobby: getLobbyById(lobbyId) };
  }
  if(lobby.guest_id){
    return { error: 'FULL' };
  }
  db.prepare(`UPDATE lobbies SET guest_id = ?, status = 'ready' WHERE id = ?`).run(userId, lobbyId);
  return { lobby: getLobbyById(lobbyId) };
}

function leaveLobby(lobbyId, userId){
  const lobby = db.prepare(`SELECT * FROM lobbies WHERE id = ?`).get(lobbyId);
  if(!lobby) return { error: 'NOT_FOUND' };
  if(lobby.host_id === userId){
    db.prepare(`DELETE FROM lobbies WHERE id = ?`).run(lobbyId);
    return { removed: true };
  }
  if(lobby.guest_id === userId){
    db.prepare(`UPDATE lobbies SET guest_id = NULL, status = 'open' WHERE id = ?`).run(lobbyId);
    return { lobby: getLobbyById(lobbyId) };
  }
  return { lobby: getLobbyById(lobbyId) };
}

function deleteLobby(lobbyId){
  db.prepare(`DELETE FROM lobbies WHERE id = ?`).run(lobbyId);
}

module.exports = {
  db,
  createUser,
  getUserByUsername,
  getUserById,
  toSafeUser,
  createSession,
  getSession,
  deleteSession,
  pruneExpiredSessions,
  listLobbies,
  upsertLobby,
  getLobbyById,
  joinLobby,
  leaveLobby,
  deleteLobby,
  updateLobbyStatus
};
