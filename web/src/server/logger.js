const path = require('path');
const {homedir} = require('os');
const winston = require('winston');
const jsonStringify = require('fast-safe-stringify');
const moment = require('moment');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({level, message}) => (
            `[${moment().format('DD-MM-YYYY HH:mm:ss')}] ${level}:\n` +
            `Method: ${message.method}\n` +
            `Login: ${message.login}\n` +
            `IP: ${message.ip}\n`+
            `Time: ${message.time}\n` +
            `Path: ${message.url}\n`
          )
        )
      ),
      level: process.env.LOG_LEVEL_CONSOLE,
      handleExceptions: true
    }),
    new winston.transports.File({
      format: winston.format.combine(
        winston.format.printf(
          ({level, message}) => JSON.stringify({
              date: moment(moment().format()).add(3, 'h').toDate(),
              params: {
                path: message.url || null,
                ip: message.ip || null,
                time: message.time || null,
                login: message.login || null
              }
          })
        )
      ),
      level: process.env.LOG_LEVEL_FILE,
      filename: path.join(__dirname, '..', '..', 'logs', `${moment().format('YYYY-DD-MM')}`),
      handleExceptions: true,
      tailable: true
    })
  ]
});

logger.expressMiddleware = function expressMiddleware(req, res, next) {

  if (req.url.includes('/api/')) {
    const startTimestemp = new Date().getTime();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const printExecutionTime = () => {
      const login = req.cookies.login;
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      const message = {
        login,
        ip,
        method: req.method,
        url: fullUrl,
        time: new Date().getTime() - startTimestemp
      };
      logger.info(message);
    };

    req.on('error', function(e) {
     res.send('problem with request: ' + e.message);
    });

    req.on('end', () => {
      if (!req.isProxy) {
        printExecutionTime();
      }
    });

    return next();
  }

  return next();
};

module.exports = logger;
