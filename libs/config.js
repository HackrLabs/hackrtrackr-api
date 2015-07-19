'use strict';
var cfg = require('../config.json')
try {
  cfg = JSON.parse(cfg)
} catch(e) {}

var config =
{ app:
  { host: process.env.APP_HOST || (cfg.app || {}) .host || '0.0.0.0'
  , port: process.env.APP_PORT || (cfg.app || {}).port || 8886
  , namespace: process.env.APP_NS || (cfg.app || {}).ns || '/api'
  , stockResponse: process.env.APP_stockRes || (cfg.app || {}).stockRes || 'json'
  }
, database:
  { user: process.env.MONGO_USER || (cfg.database || {}).user
  , pass: process.env.MONGO_PASS || (cfg.database || {}).pass
  , host: process.env.MONGO_HOST || (cfg.database || {}).host
  , port: process.env.MONGO_PORT || (cfg.database || {}).port
  , database: process.env.MONGO_DB || (cfg.database || {}).database
  }
, mysql:
  { username: process.env.MYSQL_USERNAME || (cfg.mysql || {}).username
  , password: process.env.MYSQL_PASSWORD || (cfg.mysql || {}).password
  , host: process.env.MYSQL_HOST || (cfg.mysql || {}).host || 'localhost'
  , port: process.env.MYSQL_PORT || (cfg.mysql || {}).port || 3306
  , database: process.env.MYSQL_DATABASE || (cfg.mysql || {}).database
  }
, redis:
  { expire: process.env.REDIS_EXPIRE || (cfg.redis || {}).expire || 120
  }
, token_secret: process.env.TOKEN_SECRET || cfg.token_secret || 'ads654ad8ad86ad'
};

module.exports = config;

