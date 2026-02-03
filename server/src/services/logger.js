const pino = require('pino');
const { LOG_LEVEL } = require('../config');

module.exports = pino({
  level: LOG_LEVEL,
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    : undefined
});
