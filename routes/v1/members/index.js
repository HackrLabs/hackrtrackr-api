'use strict'
var Member = require('./model')
var Cards = require('../cards/model').Card

module.exports =
{ create: create
, remove: remove
, all: all
, byId: byId
, update: update
};

/**
 * Gets all of the members and their related information from the database and
 * returns to browser
 * @public
 * @returns {null}
 */
function *all() {
  var res = yield Member.findAll({
    where:
    { isActive: true
    }
  })
    for(var i = 0; i < res.length; i++) {
      delete res[i].dataValues.password
    }
    this.body = res
    /*
    function(err, members){
    if(err){
      var apiServiceResponse = response.createResponse({message: 'Could not find members'}, true)
    } else {
      var apiServiceResponse = response.createResponse({members: members, count: members.length});
    }
    response.respondToClient(res, responseOptions, apiServiceResponse);
  });
    */
};

/**
 * Gets a single member from the database based on memberid and returns to
 * browser
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
function *byId(){
	var id = this.params.id;
  var res = yield Member.findById(id)

  if(res) {
    delete res.dataValues.password
    try {
      //res.cards = yield Cards.find({memberid: res._id})
    } catch(e) {
      console.error("Could not pull cards for member", e.stack || e)
    }
    return this.body = res
  }

  return this.status = 404;
};

/**
 * Recieves information from POST request and adds a new member to the database
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
function *create(){
  var body = this.request.body
  try {
    var res = yield Member.create(body)
    return this.status = 201
  } catch(e){
    console.error('Error: ', e.stack || e)
    this.status = 400
    return this.body =
    { error: true
    , msg: 'Error Creating User'
    }
  }
  /*
	var memberData = req.body;
	var memberID = memberData.memberid;
	var memberCards = memberData.cards;
	delete memberData.cards;
	var member = new Member();
	member
    .save(memberData, {patch: true})
    .then(function(member){
      var apiServiceResponse = response.createResponse({msg: 'success'})
      response.respondToClient(res, res.responseOptions, apiServiceResponse)
    })
    .otherwise(function(err){
      var apiServiceResponse = response.createResponse({msg: 'failed', err: err.clientError});
      response.respondToClient(res, res.responseOptions, apiServiceResponse);
    })
  */
}

/**
 * Updates a member that exists in the database from a POST request
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
function *update(){
  var currentUser = this.auth;
  var memberData = this.request.body;
	var memberID = memberData._id;
	var memberCards = memberData.cards;
  /*
  if(currentUser !== memberID) {
    this.status = 401;
    this.body =
    { error: true
    , msg: 'Unauthorized user update. Need higher permissions'
    }
  }
  */
  try {
    Member
      .update
      ( { _id: memberID
        }
      , memberData
      )
      .exec()
    //this.body = yield Member.findOne({_id: memberID}).exec()
  } catch(e) {
    console.log('Error - Member/Update: ', e.stack || e)
    throw new Error('Could not update member: ' + memberID)
  }
  /*
	delete memberData.cards;
	var member = new Member({memberid: memberID});
	member
		.save(memberData, {patch: true})
		.then(function(mem){
			// Update Cards
			updateMemberCards(memberCards, function(err){
				if(err) {
					var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true)
				} else {
					var apiServiceResponse = response.createResponse({msg: 'success', member: mem})
				}
				response.respondToClient(res, res.responseOptions, apiServiceResponse);
			})
		})
		.otherwise(function(err){
				var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true)
				response.respondToClient(res, res.responseOptions, apiServiceResponse);
		})
    */
}

/**
 * Removes a user from the database via a DELETE request
 * @public
 * @param {object} req - ExpressJS request object
 * @param {object} res - ExpressJS response objecct
 * @returns {null}
 */
function *remove(){
  var id = this.params.id
  Member
  .update
  ( { isActive: false
    }
  , { where:
      { id: id
      }
    }
  )
  /*
	new Member({memberid: memberID})
		.destroy()
		.then(function(mem){
			new Members()
				.fetch()
				.then(function(allMembers){
					var apiServiceResponse = response.createResponse({msg: 'success', members: allMembers})
					response.respondToClient(res, res.responseOptions, apiServiceResponse);
				})
		})
		.otherwise(function(err){
			var apiServiceResponse = response.createResponse({msg: 'failed', error: err}, true);
			response.respondToClient(res, res.responseOptions, apiServiceResponse)
		})
    */
};
