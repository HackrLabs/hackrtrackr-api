'use strict'
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
var Member = require('../members/model')
var config = require('../../../libs/config')

module.exports =
{ login: login
, signUp: signUp
}

/***********************
 *      Private        *
 ***********************/
function createJWT(user) {
  var now = Date.now()
  var expires = now + (1000 * 60 * 60 * 24 * 14)
  var mins = (expires - now) / 1000 / 60
  var payload =
  { sub: user.id
  , iat: now
  , exp: expires
  }
  return jwt
  .sign
  ( payload
  , config.token_secret
  , mins
  )
}



/***********************
 *      Public         *
 ***********************/

function *login() {
  try {
    var member = yield Member
    .findOne
    ( { where:
        { email: this.request.body.email
        }
      }
    )
  } catch(e) {
    console.error('Error: ', e.stack || e)
    throw new Error('No User')
  }
  try {
    console.log('body', this.request.body)
    var isMatch = member
      .validPassword
      ( this.request.body.password
      )
    return this.body =
    { token: createJWT(member)
    }
  } catch(e) {
    console.error('Error - Login: ', e.stack || e)
    this.status = 401
    this.body =
    { error: true
    , msg: 'Incorrect email and/or password combination'
    }
  }
}

function *signUp(){
  let body = this.request.body
  try {
    var member = yield Member
      .findOne
      ( { email: body.email
        }
      )
      .exec()

    if(member) {
      throw new Error('Email taken')
    }
  } catch(e) {
    this.status = 409
    return this.body =
      { msg: 'Email is already taken'
      }
  }

  var member = new Member(body)
  try {
    yield member.save()
    console.log('member saved')
    this.status = 201;
    return this.body =
      { msg: 'Member Created'
      , token: createJWT(member)
      }
  } catch(e) {
    this.status = 400
    this.body =
      { msg: 'Error creating member'
      }
  }

}
