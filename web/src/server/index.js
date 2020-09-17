const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const setupApiRoutes = require('./middlewares/api');
const logger = require('./logger');
const authFilter = require('./middlewares/auth-filter');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.HTTP_PORT = process.env.HTTP_PORT || 30007;

function onUnhandledRejection(err) {
  console.log('APPLICATION ERROR:', err);
}

function onUnhandledException(err) {
  console.log('FATAL ERROR:', err);
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledRejection);
process.on('uncaughtException', onUnhandledException);

const setupAppRoutes =
  process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);
app.use(bodyParser.json());
app.use(cookieParser());

if(process.env.NODE_ENV == 'production') {
  authFilter(app);
}

app.use(logger.expressMiddleware);
try {
  setupApiRoutes(app);
} catch (e) {
  console.log(e);
}
setupAppRoutes(app);

const srvr = http.createServer(app);
srvr.listen(process.env.HTTP_PORT, () => {
  console.log(`Server is now running on http://localhost:${process.env.HTTP_PORT}`);
});
srvr.timeout = 1800000;
