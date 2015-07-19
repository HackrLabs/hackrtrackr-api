'use strict'

var v1 = function(){
  var ensureAuth = require('../../libs/ensureAuth')
  var config = require('../../libs/config')
  var Members = require('./members/index')
  var Cards = require('./cards/index')
  var Auth = require('./auth/index')
  var r = require('koa-router')()
  r.get('/', function *(next){
    this.body =
      { active: true
      , timestamp: new Date().getTime()
      }
  })

  /*
   * Heartbeat
   */
  //r.get('/heartbeat', Heartbeat.success)

  /*
   * Auth
   */
  r.post('/auth/login', Auth.login)
  r.post('/auth/signup', Auth.signUp)

  /*
   * Members
   */
  r.post('/members', ensureAuth, Members.create)
  r.get('/members', ensureAuth, Members.all)
  //r.get('/members/me', Members.me)
  r.get('/members/:id', ensureAuth, Members.byId)
  r.del('/members/:id', ensureAuth, Members.remove)
  r.put('/members/:id', ensureAuth, Members.update)

  /*
   * Cards
   */
  r.post('/members/:member_id/cards', ensureAuth, Cards.create)
  r.get('/members/:member_id/cards', ensureAuth, Cards.get)
  r.get('/members/:member_id/cards/:id', ensureAuth, Cards.byId)

  // Return Router
  return r
}

module.exports = v1
