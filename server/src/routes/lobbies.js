const { Router } = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  listLobbies,
  upsertLobby,
  joinLobby,
  leaveLobby,
  getLobbyById,
  deleteLobby
} = require('../db');
const lobbyHub = require('../services/lobbyHub');

const router = Router();

router.get('/', (req, res)=>{
  res.json({ lobbies: listLobbies() });
});

router.post('/', requireAuth, (req, res)=>{
  const { name } = req.body || {};
  const lobby = upsertLobby({ name: name ? String(name).trim() : undefined, hostId: req.user.id });
  lobbyHub.emitLobbyUpdate(lobby.id);
  res.status(201).json({ lobby });
});

router.post('/:id/join', requireAuth, (req, res)=>{
  const { id } = req.params;
  const result = joinLobby(id, req.user.id);
  if(result.error === 'NOT_FOUND') return res.status(404).json({ error: 'LOBBY_NOT_FOUND' });
  if(result.error === 'FULL') return res.status(409).json({ error: 'LOBBY_FULL' });
  lobbyHub.emitLobbyUpdate(id);
  res.json({ lobby: result.lobby });
});

router.post('/:id/leave', requireAuth, (req, res)=>{
  const { id } = req.params;
  const result = leaveLobby(id, req.user.id);
  if(result.error === 'NOT_FOUND') return res.status(404).json({ error: 'LOBBY_NOT_FOUND' });
  if(result.removed){
    lobbyHub.teardownLobby(id);
    return res.json({ removed: true });
  }
  lobbyHub.emitLobbyUpdate(id);
  res.json({ lobby: result.lobby });
});

router.delete('/:id', requireAuth, (req, res)=>{
  const { id } = req.params;
  const lobby = getLobbyById(id);
  if(!lobby) return res.status(404).json({ error: 'LOBBY_NOT_FOUND' });
  if(lobby.hostId !== req.user.id) return res.status(403).json({ error: 'NOT_HOST' });
  deleteLobby(id);
  lobbyHub.teardownLobby(id);
  res.json({ ok: true });
});

module.exports = router;
