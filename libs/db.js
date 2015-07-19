'use strict'
var config = require('./config').database
var cfg = require('./config')
var mongoose = require('mongoose')
var Sequelize = require('sequelize')

var uri = config.user + ':' + config.pass + '@' + config.host + ':' + config.port + '/' + config.database
var database = mongoose.connect('mongodb://' + uri)
var connection = mongoose.connection
connection.on('error', console.error.bind(console, 'connection error:'))
connection.on('open', function(){
  console.log('Connected to Database')
})

var options =
{ host: cfg.mysql.host
, port: cfg.mysql.port
, pool:
  { max: 50
  , min: 0
  , idle: 10000
  }
}

if(process.env.PROD) {
  options.logging = false
}

var sequelize = new Sequelize
( cfg.mysql.database
, cfg.mysql.username
, cfg.mysql.password
, options
)

var db =
{ db: database
, mongoose: mongoose
, connection: connection
, sequelize: sequelize
, Sequelize: Sequelize
}

module.exports = db
