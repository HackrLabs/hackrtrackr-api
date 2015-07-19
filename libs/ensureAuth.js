var jwt = require('jsonwebtoken'),
    config = require('./config'),
    Member = require('../routes/v1/members/model')

module.exports = function *ensureAuth(next) {
  var request = this.request
  if( !request.headers.authorization ){
    this.status = 401
    return this.body =
      { msg: 'This route requires authorization.'
      }
  }
  var token = request.headers.authorization.split(' ')[1]
  var payload = null
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET)
  } catch(err) {
    console.error('Error:', err.message)
    this.status = 401
    return this.body =
      { msg: 'This route requires authorization'
      }
  }

  if(payload.exp <= Date.now()){
    this.status = 401;
    return this.body =
      { msg: 'Token has expired'
      }
  }
  console.log('payload: ', payload)
  this.auth = yield Member.findById(payload.sub)

  /*
  try {
    yield checkRole()
  } catch(e) {
    this.status = 401
    return this.body =
    { msg: 'This route requires authorization.'
    }
  }
  */

  yield next;
}
