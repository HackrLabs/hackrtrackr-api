'use strict';
var db = require('../../../libs/db').sequelize,
    Sequelize = require('../../../libs/db').Sequelize,
    Member = require('../members/model')

var schema =
(
  { id:
    { type: Sequelize.BIGINT
    , primaryKey: true
    , autoIncrement: true
    }
  , memberId:
    { type: Sequelize.BIGINT
    , references:
      { model: Member
      , key: 'id'
      }
    }
  , type:
    { type: Sequelize.ENUM
    , values:
      [ 'nfc'
      , 'rfid'
      ]
    , defaultValue: 'nfc'
    }
  , name:
    { type: Sequelize.STRING
    }
  , uid:
    { type: Sequelize.STRING
    }
  , isActive:
    { type: Sequelize.BOOLEAN
    , defaultValue: true
    }
  }
)

var Card = db
.define
( 'Card'
, schema
)

Card.sync().then(function(){
  console.log('Card table synced')
})

module.exports = Card
