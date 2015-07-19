'use strict';
var Card = require('./model')

module.exports =
{ create: create
, get: get
, byId: byId
, remove: remove
};


function *create() {
  var card = this.request.body;
  //card.cardid = convertCardToHex(card.cardid);
  var res = yield Card.create(card)
  return this.status = 201
}

/**
 * Get
 * @function
 * Retrieve cards by Member ID
 */
function *get() {
  var id = this.params.member_id
  try {
    var cards = yield Card.findAll({where: {memberId: id}})
  } catch(e) {
    cards = []
  }

  this.body = cards
}

function *byId() {
  try {
    var cards = yield Card
      .findAll
      ( { where:
          { memberId: this.request.member_id
          , id: this.request.id
          }
        }
      )
    return this.body = cards
  } catch(e) {
    this.status = 204
    return this.body = {}
  }
}

function *remove() {
	var cardID = req.params.id;
  yield card
    .update
    ( { isActive: false
      }
    , { where:
        { id: cardId
        //, member_id: this.auth
        }
      }
    )
}

var convertCardToHex = function(card){
	var convertedCard = Number(card).toString(16);
	if(convertedCard.length < 4) {
		convertedCard = '??0' + convertedCard;
	} else {
		convertedCard = '??' + convertedCard;
	}
	return convertedCard;
}


