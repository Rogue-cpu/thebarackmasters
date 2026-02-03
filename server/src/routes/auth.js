const { Router } = require('express');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername, createSession, deleteSession, toSafeUser } = require('../db');
const { requireAuth } = require('../middleware/auth');
const { SESSION_COOKIE_NAME, SESSION_TTL_MS } = require('../config');

const router = Router();
const SALT_ROUNDS = 12;

function attachSession(res, session){
  res.cookie(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_TTL_MS,
    secure: process.env.NODE_ENV === 'production'
  });
}

router.post('/signup', async (req, res)=>{
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'USERNAME_AND_PASSWORD_REQUIRED' });
  const normalized = String(username).trim();
  if(normalized.length < 3 || normalized.length > 24) return res.status(400).json({ error: 'USERNAME_LENGTH' });
  const existing = getUserByUsername(normalized);
  if(existing) return res.status(409).json({ error: 'USERNAME_TAKEN' });
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = createUser(normalized, passwordHash);
  if(!user) return res.status(500).json({ error: 'CREATE_FAILED' });
  const session = createSession(user.id);
  attachSession(res, session);
  res.json({ token: session.token, user });
});

router.post('/login', async (req, res)=>{
  const { username, password } = req.body || {};
  if(!username || !password) return res.status(400).json({ error: 'USERNAME_AND_PASSWORD_REQUIRED' });
  const record = getUserByUsername(String(username));
  if(!record) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const valid = await bcrypt.compare(password, record.password_hash);
  if(!valid) return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  const session = createSession(record.id);
  attachSession(res, session);
  res.json({ token: session.token, user: toSafeUser(record) });
});

router.post('/logout', requireAuth, (req, res)=>{
  if(req.session){
    deleteSession(req.session.token);
    res.clearCookie(SESSION_COOKIE_NAME);
  }
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res)=>{
  res.json({ user: req.user });
});

module.exports = router;
