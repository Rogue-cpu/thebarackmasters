const { WebSocketServer, WebSocket } = require('ws');
const url = require('url');
const { getSession, getUserById, getLobbyById, listLobbies } = require('../db');
const logger = require('./logger');

class LobbyHub {
  constructor(){
    this.wss = null;
    this.lobbyState = new Map();
    this.subscribers = new Map();
  }

  attach(httpServer){
    if(this.wss) return;
    this.wss = new WebSocketServer({ noServer: true });

    httpServer.on('upgrade', (request, socket, head)=>{
      const { pathname, query } = url.parse(request.url, true);
      if(pathname !== '/ws'){
        socket.destroy();
        return;
      }
      const token = query.token;
      const session = getSession(token);
      const user = session && session.expires_at > Date.now() ? getUserById(session.user_id) : null;
      if(!user){
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }
      this.wss.handleUpgrade(request, socket, head, ws => {
        ws.user = user;
        ws.sessionToken = token;
        ws.currentLobby = null;
        ws.on('message', data => this.handleMessage(ws, data));
        ws.on('close', ()=> this.handleDisconnect(ws));
        ws.send(JSON.stringify({ type: 'hello', payload: { user } }));
      });
    });
  }

  handleDisconnect(ws){
    if(ws.currentLobby){
      const subs = this.subscribers.get(ws.currentLobby);
      if(subs) subs.delete(ws);
    }
  }

  handleMessage(ws, data){
    let msg;
    try{
      msg = JSON.parse(data.toString());
    }catch(err){
      logger.warn({ err }, 'invalid websocket payload');
      return;
    }
    const { type, payload } = msg;
    switch(type){
      case 'lobby:subscribe':
        return this.subscribe(ws, payload);
      case 'lobby:setReady':
        return this.setReady(ws, payload);
      case 'lobby:setFleet':
        return this.setFleet(ws, payload);
      case 'chat:message':
        return this.postChat(ws, payload);
      case 'match:command':
        return this.forwardCommand(ws, payload);
      default:
        logger.debug({ type }, 'unknown ws message');
    }
  }

  ensureState(lobbyId){
    if(!this.lobbyState.has(lobbyId)){
      this.lobbyState.set(lobbyId, {
        ready: { host: false, guest: false },
        fleets: { host: [], guest: [] },
        chat: []
      });
    }
    return this.lobbyState.get(lobbyId);
  }

  subscribe(ws, payload){
    const { lobbyId } = payload || {};
    const lobby = getLobbyById(lobbyId);
    if(!lobby) return ws.send(JSON.stringify({ type: 'error', payload: { error: 'LOBBY_NOT_FOUND' } }));
    if(lobby.hostId !== ws.user.id && lobby.guestId !== ws.user.id){
      return ws.send(JSON.stringify({ type: 'error', payload: { error: 'NOT_IN_LOBBY' } }));
    }
    if(ws.currentLobby && ws.currentLobby !== lobbyId){
      const prev = this.subscribers.get(ws.currentLobby);
      if(prev) prev.delete(ws);
    }
    ws.currentLobby = lobbyId;
    if(!this.subscribers.has(lobbyId)) this.subscribers.set(lobbyId, new Set());
    this.subscribers.get(lobbyId).add(ws);
    this.emitLobbyUpdate(lobbyId);
  }

  roleFor(lobby, userId){
    if(!lobby) return null;
    if(lobby.hostId === userId) return 'host';
    if(lobby.guestId === userId) return 'guest';
    return null;
  }

  setReady(ws, payload){
    const { lobbyId, ready } = payload || {};
    const lobby = getLobbyById(lobbyId);
    const role = this.roleFor(lobby, ws.user.id);
    if(!role) return;
    const state = this.ensureState(lobbyId);
    state.ready[role] = !!ready;
    this.emitLobbyUpdate(lobbyId);
    if(state.ready.host && state.ready.guest){
      const seed = Date.now();
      this.broadcast(lobbyId, { type: 'match:start', payload: { lobbyId, seed, fleets: state.fleets } });
      state.ready.host = false;
      state.ready.guest = false;
    }
  }

  setFleet(ws, payload){
    const { lobbyId, ships } = payload || {};
    const lobby = getLobbyById(lobbyId);
    const role = this.roleFor(lobby, ws.user.id);
    if(!role) return;
    const state = this.ensureState(lobbyId);
    state.fleets[role] = Array.isArray(ships) ? ships.slice(0, 6) : [];
    this.emitLobbyUpdate(lobbyId);
  }

  postChat(ws, payload){
    const { lobbyId, message } = payload || {};
    const lobby = getLobbyById(lobbyId);
    if(!this.roleFor(lobby, ws.user.id)) return;
    const trimmed = String(message || '').trim();
    if(!trimmed) return;
    const state = this.ensureState(lobbyId);
    const entry = { id: Date.now(), user: ws.user.username, message: trimmed };
    state.chat.push(entry);
    state.chat = state.chat.slice(-50);
    this.broadcast(lobbyId, { type: 'chat:message', payload: entry });
  }

  forwardCommand(ws, payload){
    const { lobbyId } = payload || {};
    const lobby = getLobbyById(lobbyId);
    if(!this.roleFor(lobby, ws.user.id)) return;
    this.broadcast(lobbyId, { type: 'match:command', payload: { ...payload, userId: ws.user.id } });
  }

  broadcast(lobbyId, data){
    const subs = this.subscribers.get(lobbyId);
    if(!subs) return;
    const message = JSON.stringify(data);
    for(const ws of subs){
      if(ws.readyState === WebSocket.OPEN){
        ws.send(message);
      }
    }
  }

  emitLobbyUpdate(lobbyId){
    const lobby = listLobbies().find(l=> l.id === lobbyId);
    if(!lobby){
      this.teardownLobby(lobbyId);
      return;
    }
    const state = this.ensureState(lobbyId);
    this.broadcast(lobbyId, { type: 'lobby:update', payload: { lobby, state } });
  }

  teardownLobby(lobbyId){
    const subs = this.subscribers.get(lobbyId);
    if(subs){
      const message = JSON.stringify({ type: 'lobby:closed', payload: { lobbyId } });
      for(const ws of subs){
        if(ws.readyState === ws.OPEN) ws.send(message);
        ws.currentLobby = null;
      }
      subs.clear();
    }
    this.subscribers.delete(lobbyId);
    this.lobbyState.delete(lobbyId);
  }
}

module.exports = new LobbyHub();
