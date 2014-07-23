'use strict'
var config = require('./config').mongo
var mongoose = require('mongoose')
var uri = config.user + ':' + config.pass + '@' + config.host + ':' + config.port + '/' + config.database
var database = mongoose.connect('mongodb://' + uri)
var connection = mongoose.connection
connection.on('error', console.error.bind(console, 'connection error:'))
connection.on('open', function(){
  console.log('Connected to Database')
})
var db =
{ db: database
, mongoose: mongoose
, connection: connection
}

module.exports = db
