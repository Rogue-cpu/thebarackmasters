const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function ensureDataDir(){
  const dataDir = process.env.DATA_DIR || path.resolve(__dirname, '../data');
  fs.mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

const DATA_DIR = ensureDataDir();

module.exports = {
  PORT: parseInt(process.env.SERVER_PORT || '4000', 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  SESSION_TTL_MS: parseInt(process.env.SESSION_TTL || String(1000 * 60 * 60 * 24 * 7), 10),
  DB_PATH: process.env.DB_PATH || path.join(DATA_DIR, 'barack_master.sqlite'),
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'sb_token',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
