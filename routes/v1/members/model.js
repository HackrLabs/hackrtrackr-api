'use strict';
var db = require('../../../libs/db').sequelize,
    Sequelize = require('../../../libs/db').Sequelize,
    bcrypt = require('bcryptjs')

var schema =
{ id:
  { type: Sequelize.BIGINT
  , autoIncrement: true
  , primaryKey: true
  }
, firstname:
  { type: Sequelize.STRING
  }
, lastname:
  { type: Sequelize.STRING
  }
, email:
  { type: Sequelize.STRING
  , unique: true
  }
, handle:
  { type: Sequelize.STRING
  }
, password:
  { type: Sequelize.STRING
  , allowNull: false
  }
, address:
  { type: Sequelize.STRING
  }
, address2:
  { type: Sequelize.STRING
  }
, city:
  { type: Sequelize.STRING
  }
, state:
  { type: Sequelize.STRING
  }
, zipcode:
  { type: Sequelize.STRING
  }
, country:
  { type: Sequelize.STRING
  , allowNull: false
  , defaultValue: 'USA'
  }
, phone:
  { type: Sequelize.STRING
  }
, dob:
  { type: Sequelize.DATE
  }
, joinDate:
  { type: Sequelize.DATE
  }
, paperFillDate:
  { type: Sequelize.DATE
  }
, waiver:
  { type: Sequelize.BOOLEAN
  , defaultValue: false
  , allowNull: false
  }
, memberLevel:
  { type: Sequelize.ENUM
  , values:
    [ 'maker'
    , 'student'
    , 'booster'
    ]
  , defaultValue: 'maker'
  , allowNull: false
  , set: function(val) {
      this.setDataValue('memberLevel', val.toLowerCase())
    }
  }
, memberStatus:
  { type: Sequelize.ENUM
  , values:
    [ 'in process'
    , 'good standing'
    , 'probation'
    , 'banned'
    ]
  , defaultValue: 'in process'
  , allowNull: false
  , set: function(val) {
      this.setDataValue('memberStatus', val.toLowerCase())
    }
  }
, adminLevel:
  { type: Sequelize.INTEGER
  , defaultValue: 0
  , allowNull: false
  }
, isActive:
  { type: Sequelize.BOOLEAN
  , defaultValue: true
  , allowNull: false
  }
}

var hashPassword = function(member, options, done) {
  if(!member.changed('password')) {
    return done()
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return done(err)
    }
    bcrypt.hash(member.password, salt, function(err, hash) {
      if (err) {
        return done(err)
      }
      member.password = hash
      done()
    });
  });
}

var stripPassword = function(members, options, done) {
  for(var i = 0; i < members.length; i++) {
    delete members[i].password
  }
  done()
}

var Member = db
.define
( 'Member'
, schema
, { instanceMethods:
    { generateHash: function(password, done) {
        bcrypt.genSalt(10, function(err, salt){
          bcrypt.hash(model.password, salt, null, function(err, hash){
            if(err) {
              return done(err)
            }
            model.password = hash
            done()
          })
        })
      }
    , validPassword: function(password, next) {
        return bcrypt.compareSync(password, this.password)
      }
    }
  }
, { instanceMethods:
    { toJSON: function() {
        this.dataValues.password = null
        return this.dataValues
      }
    }
  }
)

Member.beforeCreate(hashPassword)
Member.beforeUpdate(hashPassword)

Member.sync().then(function(){
  console.log('Member table synced')
})

module.exports = Member
