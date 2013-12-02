exports.mongojs = require('mongojs');
exports.db = exports.mongojs.connect('cs397', ['hits', 'games', 'players', 'sessions']);		//mongoDB module


//Save coordinate to mongodb
exports.Hit = function(x, y, time, gameId, playerId, hitId){
	this.x = x;
	this.y = y;
	this.time = (time ? time : new Date());
	this.gameId = gameId;
	this.playerId = playerId;
	this.id = hitId;
}
/**
@param {mongojs:ObjectId} gameId (optional)
@param {mongojs:ObjectId} playerId (optional)
@return {Array} of hit objects that are from the given game and/or player
*/
exports.Hit.fromDB = function(gameId, playerId, callback){
	var matchedHits = new Array();
	if (playerId && gameId){
		exports.db.hits.find({gameId: gameId, playerId: playerId}, function(err, hits) {
			if( err || !hits){ 
				console.log("No hits found");
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			}
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
			if (callback && typeof(callback) === "function") { 
				callback(matchedHits);
			}
		});
	} else if (gameId && !playerId){
		exports.db.hits.find({gameId: gameId}, function(err, hits) {
			if( err || !hits){ 
				console.log("No hits found");
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			}
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
			if (callback && typeof(callback) === "function") { 
				callback(matchedHits);
			}
		});
	} else if (!gameId && playerId){
		exports.db.hits.find({playerId: playerId}, function(err, hits) {
			if( err || !hits){ 
				console.log("No hits found");
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			}
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
			if (callback && typeof(callback) === "function") { 
				callback(matchedHits);
			}
		});
	} else {
		exports.db.hits.find(function(err, hits) {
			if( err || !hits){ 
				console.log("No hits found");
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			}
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
			if (callback && typeof(callback) === "function") { 
				callback(matchedHits);
			}
		});
	}
}

//save this hit to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Hit.prototype.save = function (callback){
	if (this.id){
		exports.db.hits.update({_id: this.id}, {$set: {x: this.x, y: this.y, timestamp: this.time, gameId: this.gameId, playerId: this.playerId}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving coordinate:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
			} else {
				console.log("Coordinate saved to database");
				if (callback && typeof(callback) === "function") { 
					callback(new exports.Hit(saved.x, saved.y, saved.timestamp, saved.gameId, saved.playerId, saved._id));
				}
			}
		});
	} else {
		exports.db.hits.save({x: this.x, y: this.y, timestamp: this.time, gameId: this.gameId, playerId: this.playerId}, function(error, saved){
			if (error || !saved){
				console.log("Error saving coordinate:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
			} else {
				console.log("Coordinate saved to database");
				if (callback && typeof(callback) === "function") { 
					callback(new exports.Hit(saved.x, saved.y, saved.timestamp, saved.gameId, saved.playerId, saved._id));
				}
			}
		});
	}
}
exports.Player = function(name, password, playerId){
	this.name = name;
	this.password = password;
	this.id = playerId;
}

//returns all players in the database
exports.Player.fromDB = function(callback){
	var allPlayers = new Array();
	exports.db.players.find(function(err, players){
		if( err || !players){
			console.log("No players found");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		}
		else players.forEach( function(player) {
			allPlayers.push(new exports.Player(player.name, player.password, player._id));
		});
		if (callback && typeof(callback) === "function") { 
			callback(allPlayers);
		}
	});
}
//returns player stored in the datbase with the given id
exports.Player.fromId = function(playerId, callback){
	exports.db.players.findOne({_id: playerId}, function(err, player){
		if( err || !player){
			console.log("No players found");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		}
		else {
			if (callback && typeof(callback) === "function") { 
				callback(new exports.Player(player.name, player.password, player._id));
			}
		}
	});
}
//returns player stored in the datbase with the given name
exports.Player.fromName = function(name, callback){
	exports.db.players.findOne({name: name}, function(err, player){
		if( err || !player){
			console.log("No players found");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		} else {
			var retVal = new exports.Player(player.name, player.password, player._id);
			callback(retVal);
		}
	});
}
//returns player stored in the datbase with the given name and password
exports.Player.fromCredentials = function(name, password, callback){
	exports.db.players.findOne({name: name, password: password}, function(err, player){
		if( err || !player){
			console.log("No players found");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		} else {
			var retVal = new exports.Player(player.name, player.password, player._id);
			callback(retVal);
		}
	});
}
//save this player to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Player.prototype.save = function(callback){
	var result;
	if (this.playerId){
		exports.db.players.update({_id: this.id}, {$set: {name: this.name, password: this.password}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving player:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
			} else {
				console.log("Player saved to database");
				result = new Player(saved.name, saved.password, saved._id);
				if (callback && typeof(callback) === "function") { 
					callback(result);
				}
			}
		});
	}
	else{
		exports.db.players.save({name: this.name, password: this.password}, function(error, saved){
			if (error || !saved){
				console.log("Error saving player:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
			} else {
				console.log("Player saved to database");
				result =  new exports.Player(saved.name, saved.password, saved._id);
				if (callback && typeof(callback) === "function") { 
					callback(result);
				}
			}
		});
	}
}

exports.Game = function(players, gameId){
	this.id = gameId;
	if (players && players.length){
		this.player1 = players[0];
		if (players.length>1){
			this.player2 = players[1];
		}
	}
}
//returns the games in the database with the given id
exports.Game.fromId = function(gameId, callback){
	exports.db.games.findOne({_id: gameId}, function(err, game) {
		if( err || !game){
			console.log("No games found with id");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		}
		else {
			if (callback && typeof(callback) === "function") { 
				callback(new exports.Game([game.player1, game.player2], game._id));
			}
		}
	});
}

//returns all games in the database with the given player id as one of the players
exports.Game.fromPlayerId = function(playerId, callback){
	matchedGames = new Array();
	exports.db.games.find({player1: playerId}, function(err, games) {
		if( err ){
			console.log("error");
			return;
		}
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game._id));
		});
	});	
	exports.db.games.find({player2: playerId}, function(err, games) {
		if( err ) console.log("error");
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game._id));
		});
	});
	if (callback && typeof(callback) === "function") {
		callback(matchedGames);
	}
}
//returns all games from database
exports.Game.fromDB = function(callback){
	var matchedGames = new Array();
	exports.db.games.find(function(err, games) {
		if( err || !games){
			console.log("error");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
			return;
		}
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game._id));
		});
		if (callback && typeof(callback) === "function") { 
			callback(matchedGames);
		}
	});	
}

//save this game to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Game.prototype.save = function(callback){
	if (this.gameId){
		exports.db.games.update({_id: this.id}, {$set: {player1: this.player1, player2: this.player2}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving game:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			} else {
				console.log("Game saved to database");
				if (callback && typeof(callback) === "function") { 
					callback(new exports.Game([saved.player1, saved.player2], saved._id));
				}
			}
		});
	}
	else{
		exports.db.games.save({player1: this.player1, player2: this.player2}, function(error, saved){
			if (error || !saved){
				console.log("Error saving game:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			} else {
				console.log("Game saved to database");
				if (callback && typeof(callback) === "function") { 
					callback(new exports.Game([saved.player1, saved.player2], saved._id));
				}
			}
		});
	}
}

//convert a string to a mongodb id object
exports.stringToId = function(stringId){
	return exports.mongojs.ObjectId(stringId);
}


exports.Session = function(sessionId, username, password, gameId, timestamp){
	this.username = username;
	this.password = password;
	this.id = sessionId;
	this.gameId = gameId;
	this.timestamp = timestamp ?  timestamp : new Date();
}
exports.Session.fromDB = function(sessionId, callback){
	exports.db.sessions.findOne({_id: sessionId}, function(err, session) {
		if( err || !session){
			console.log("No sessions found with id");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		}
		else {
			if (callback && typeof(callback) === "function") { 
				callback(new exports.Session(session._id, session.username, session.password));
			}
		}
	});
}
exports.Session.prototype.newGame = function(player1, player2, callback){
	(new exports.Game([player1, player2])).save(function(game){
		exports.db.sessions.update({_id: this.id}, {$set: {gameId: game.id}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving session:  " + error );
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			} else {
				console.log("Session saved to database");
				if (callback && typeof(callback) === "function") { 
					callback(new exports.Session(saved._id, saved.username, saved.password, saved.gameId, saved.timestamp));
				}
			}
		});
	});
}
exports.Session.fromId = function(sessionId, callback){
	exports.db.sessions.findOne({_id: sessionId}, function(err, session) {
		if( err || !session){
			console.log("No sessions found with id");
			if (callback && typeof(callback) === "function") { 
				callback();
			}
		}
		else {
			if (callback && typeof(callback) === "function") { 
				callback(new exports.Session(session._id, session.username, session.password, session.gameId, session.timestamp));
			}
		}
	});	
}
exports.Session.create = function(username, password, callback){
	exports.Player.fromCredentials(username, password, function(player){
		if (!player || !player.id){
			if (callback && typeof(callback) === "function") { 
				console.log("user not found");
				callback();
			}
			return;
		}
		var game = new exports.Game([player.id, null]);
		game.save(function(game){
			exports.db.sessions.save({username: username, password: password, gameId: game.id, timestamp: new Date()}, function(error, saved){
				if (error || !saved){
					console.log("Error saving session:  " + error );
					if (callback && typeof(callback) === "function") { 
						callback();
					}
					return;
				} else {
					console.log("Session saved to database");
					if (callback && typeof(callback) === "function") { 
						callback(new exports.Session(saved._id, saved.username, saved.password, saved.gameId, saved.timestamp));
					}
				}
			});
		});

	});
}
exports.Session.prototype.validate = function(callback){
	exports.db.sessions.findOne({_id: this.id, username: this.username, password: this.password}, function(err, session) {
		if( err || !session){
			console.log("No sessions found with id");
			if (callback && typeof(callback) === "function") { 
				callback(false);
			}
		}
		else {
			if (callback && typeof(callback) === "function") { 
				callback(true);
			}
		}
	});
}


exports.Session.getActiveGame = function(callback){
	exports.db.sessions.find({}).sort({timestamp:-1}).limit(1, function(err, session){
		if (!session || !session[0]){
			console.log("session not found")
			if (callback && typeof(callback) === "function") { 
				callback();
			}
			return;
		}
		session = session[0];
		exports.Player.fromName(session.username, function(player){
			if (!player){
				if (callback && typeof(callback) === "function") { 
					callback();
				}
				return;
			}
			if (callback && typeof(callback) === "function") { 
				callback(new exports.Session(session._id, player.id, session.password, session.gameId, session.timestamp));
			}
		});
	});
}
/***
	cx, cy - center of target
	r1, r2 - inner and outer radius of ring
***/
exports.Ring = function(cx, cy, r1, r2, value){
	this.cx = cx;
	this.cy = cy;
	this.r1 = r1;
	this.r2 = r2;
	this.value = value;
}
exports.Ring.prototype.inRing = function(x, y){
	function distance(x1, y1, x2, y2){
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	}
	var pointRadius = distance(x, y, this.cx, this.cy);
	return (pointRadius >= this.r1 && pointRadius <= this.r2);
}
exports.Target = function(width, height){
	this.rings = new Array();
	cx = width/2;
	cy = height/2;
	this.rings.push(new exports.Ring(cx, cy, 0, 49, 100));
	this.rings.push(new exports.Ring(cx, cy, 50, 100, 50));
	this.rings.push(new exports.Ring(cx, cy, 101, 149, 25));
	this.rings.push(new exports.Ring(cx, cy, 150, 200, 15));
	this.rings.push(new exports.Ring(cx, cy, 151, 249, 10));
	this.rings.push(new exports.Ring(cx, cy, 250, 300, 5));
}

exports.Target.prototype.hitValue = function(hit){
	for (var i=0; i<this.rings.length; i++){
		if (this.rings[i].inRing(hit.x, hit.y)){
			return this.rings[i].value;
		}
	}
	return 0;
}

exports.basicTarget = new exports.Target(500, 500);

exports.getScores = function(gameId, callback){
	var player1Score = 0, 
	player2Score = 0;
	exports.Game.fromId(gameId, function(game){
		exports.Hit.fromDB(gameId, null, function(hits){
			for(var i = 0; i < hits.length; i++){
				var hitValue = exports.basicTarget.hitValue(hits[i]);
				if (hits[i].playerId.toString() == game.player1.toString()){
					player1Score += hitValue;
				} else {
					player2Score += hitValue;
				}
			}
			if (callback && typeof(callback) === "function") { 
				callback(player1Score, player2Score)
			}
		});
	});
}