const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { PORT, CLIENT_ORIGIN } = require('./config');
const logger = require('./services/logger');
const authRouter = require('./routes/auth');
const lobbyRouter = require('./routes/lobbies');
const { optionalAuth } = require('./middleware/auth');
const lobbyHub = require('./services/lobbyHub');
const { pruneExpiredSessions } = require('./db');

const app = express();

app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: false }));
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(optionalAuth);

app.get('/health', (req, res)=>{
  res.json({ ok: true, user: req.user || null });
});

app.use('/api', authRouter);
app.use('/api/lobbies', lobbyRouter);

app.use((err, _req, res, _next)=>{
  logger.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'INTERNAL_ERROR' });
});

const server = http.createServer(app);
lobbyHub.attach(server);

server.listen(PORT, ()=>{
  logger.info({ port: PORT }, 'server listening');
});

setInterval(pruneExpiredSessions, 1000 * 60 * 30);
