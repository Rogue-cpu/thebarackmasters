const { SESSION_COOKIE_NAME } = require('../config');
const { getSession, getUserById, deleteSession } = require('../db');

function extractToken(req){
  const header = req.headers['authorization'];
  if(header && header.startsWith('Bearer ')){
    return header.slice(7);
  }
  if(req.cookies && req.cookies[SESSION_COOKIE_NAME]){
    return req.cookies[SESSION_COOKIE_NAME];
  }
  return null;
}

async function requireAuth(req, res, next){
  const token = extractToken(req);
  if(!token) return res.status(401).json({ error: 'UNAUTHENTICATED' });
  const session = getSession(token);
  if(!session || session.expires_at < Date.now()){
    deleteSession(token);
    return res.status(401).json({ error: 'SESSION_EXPIRED' });
  }
  const user = getUserById(session.user_id);
  if(!user){
    deleteSession(token);
    return res.status(401).json({ error: 'INVALID_SESSION' });
  }
  req.session = session;
  req.user = user;
  next();
}

function optionalAuth(req, _res, next){
  const token = extractToken(req);
  if(!token) return next();
  const session = getSession(token);
  if(session && session.expires_at > Date.now()){
    const user = getUserById(session.user_id);
    if(user){
      req.session = session;
      req.user = user;
    }
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
  extractToken
};
