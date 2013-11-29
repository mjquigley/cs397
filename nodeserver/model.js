exports.mongojs = require('mongojs');
exports.db = exports.mongojs.connect('cs397', ['hits', 'games', 'players']);		//mongoDB module


//Save coordinate to mongodb
exports.Hit = function(x, y, time, gameId, playerId, hitId){
	this.x = x;
	this.y = y;
	this.time = (typeof time !== 'undefined' ? time : new Date());
	this.gameId = gameId;
	this.playerId = playerId;
	this.id = hitId;
}
/**
@param {mongojs:ObjectId} gameId (optional)
@param {mongojs:ObjectId} playerId (optional)
@return {Array} of hit objects that are from the given game and/or player
*/
exports.Hit.fromDB = function(gameId, playerId){
	var hits = new Array();
	if (playerId && gameId){
		db.hits.find({gameId: gameId, playerId: playerId}, function(err, hits) {
			if( err || !hits) console.log("No hits found for given game/player");
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
		});
	} else if (gameId && !playerId){
		db.hits.find({gameId: gameId}, function(err, hits) {
			if( err || !hits) console.log("No hits found for given game");
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
		});
	} else if (!gameId && playerId){
		db.hits.find({playerId: playerId}, function(err, hits) {
			if( err || !hits) console.log("No hits found for given player");
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
		});
	} else {
		db.hits.find(function(err, hits) {
			if( err || !hits) console.log("No hits found");
			else hits.forEach( function(hit) {
				matchedHits.push(new exports.Hit(hit.x, hit.y, hit.time, hit.gameId, hit.playerId));
			});
		});
	}
	return matchedHits;
}

//save this hit to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Hit.prototype.save = function (){
	if (this.id){
		exports.db.hits.update({_id: this.id}, {$set: {x: this.x, y: this.y, timestamp: this.time, gameId: this.gameId, playerId: this.playerId}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving coordinate:  " + error );
			} else {
				console.log("Coordinate saved to database");
				return saved;
			}
		});
	} else {
		exports.db.hits.save({x: this.x, y: this.y, timestamp: this.time, gameId: this.gameId, playerId: this.playerId}, function(error, saved){
			if (error || !saved){
				console.log("Error saving coordinate:  " + error );
			} else {
				console.log("Coordinate saved to database");
				return saved;
			}
		});
	}
}
exports.Player = function(name, playerId){
	this.name = name;
	this.playerId = playerId;
}

//returns all players in the database
exports.Player.fromDB = function(){
	var allPlayers = new Array();
	db.players.find(function(err, players){
		if( err || !players) console.log("No players found");
		else players.forEach( function(player) {
			allPlayers.push(new exports.Player(player.name, player.id));
		});
	});
	return allPlayers;
}
//returns player stored in the datbase with the given id
exports.Player.fromId = function(playerId){
	db.players.findOne({_id: playerId}, function(err, player){
		if( err || !player) console.log("No players found");
		else {
			return new exports.Player(player.name, player.id);
		}
	});
}
//save this player to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Player.prototype.save = function(){
	if (this.playerId){
		exports.db.players.update({_id: this.playerId}, {$set: {name: this.name}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving player:  " + error );
			} else {
				console.log("Player saved to database");
				return saved;
			}
		});
	}
	else{
		exports.db.players.save({name: this.name}, function(error, saved){
			if (error || !saved){
				console.log("Error saving player:  " + error );
			} else {
				console.log("Player saved to database");
				return saved;
			}
		});
	}
}

exports.Game = function(players, id){
	this.gameId = id;
	if (players && players.length){
		this.player1 = players[0];
		if (players.length>1){
			this.player2 = players[1];
		}
	}
}
//returns the games in the database with the given id
exports.Game.fromId = function(gameId){
	db.games.findOne({_id: gameId}, function(err, game) {
		if( err || !game) console.log("No games found with id");
		else {
			return new exports.Game([game.player1, game.player2], game.id);
		}
	});
}

//returns all games in the database with the given player id as one of the players
exports.Game.fromPlayerId = function(playerId){
	matchedGames = new Array();
	db.games.find({player1: playerId}, function(err, games) {
		if( err ) console.log("error");
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game.id));
		});
	});	
	db.games.find({player2: playerId}, function(err, games) {
		if( err ) console.log("error");
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game.id));
		});
	});
	return matchedGames;
}
//returns all games from database
exports.Game.fromDB = function(){
	db.games.find(function(err, games) {
		if( err || !games) console.log("error");
		else games.forEach( function(game) {
			matchedGames.push(new exports.Game([game.player1, game.player2], game.id));
		});
	});	
}

//save this game to the database (updating the entry if it already exists)
//returns: new/updated database entry
exports.Game.prototype.save = function(){
	if (this.gameId){
		exports.db.games.update({_id: this.gameId}, {$set: {player1: this.player1, player2: this.player2}}, function(error, saved){
			if (error || !saved){
				console.log("Error saving game:  " + error );
			} else {
				console.log("Game saved to database");
				return saved;
			}
		});
	}
	else{
		exports.db.games.save({player1: this.player1, player2: this.player2}, function(error, saved){
			if (error || !saved){
				console.log("Error saving game:  " + error );
			} else {
				console.log("Game saved to database");
				return saved;
			}
		});
	}
}

//convert a string to a mongodb id object
exports.stringToId = function(stringId){
	return exports.mongojs.ObjectId(stringId);
}

