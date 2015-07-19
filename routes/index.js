'use strict'

var routes = function() {
  var config = require('../libs/config')
  var r = require('koa-router')()
  var v1 = require('./v1/index')

  r.prefix(config.app.namespace)
  r.use('/v1', v1().routes())

  return r
}

module.exports = routes
