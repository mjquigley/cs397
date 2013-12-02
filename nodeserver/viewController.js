var spawn = require('child_process').spawn;				//process spawning module
var socketServer = require('./socketServer.js');		//Import and start websocket server
var httpServer = require('./httpServer.js').server;		//Import and start http server
var model = require('./model.js');

//Listen for new coordinates from serial input
var serialInput = spawn ('node', ['sampleReciever.js']);
var player1Score = 0;
var player2Score = 0;
function getActiveGameScores(activeGame, callback){
	model.getScores(activeGame.gameId, function(score1, score2){
		if (score1) player1Score = score1;
		if (score2) player2Score = score2;
		if (callback && typeof(callback) === "function") { 
			callback(score1, score2);
		}
	});
}
model.Session.getActiveGame(function(activeGame){
	if (activeGame){
		getActiveGameScores(activeGame);
	}
});

var currentGame = null;
serialInput.stdout.on('data', function(data){
	var input = JSON.parse(data);
	if (input.x && input.y){
		model.Session.getActiveGame(function(activeGame){
			if (activeGame){
				if (!currentGame){
					currentGame = activeGame;
				}
				if (activeGame.gameId != currentGame.gameId){
					currentGame = activeGame;
					getActiveGameScores(currentGame, function(score1, score2){
						player1Score = score1 + model.basicTarget.hitValue(new model.Hit(input.x, input.y));
						socketServer.sendData(input.x, input.y, player1Score, player2Score);
						(new model.Hit(input.x, input.y, new Date(), activeGame.gameId, activeGame.username)).save();
					});
				} else {
					player1Score += model.basicTarget.hitValue(new model.Hit(input.x, input.y));
					socketServer.sendData(input.x, input.y, player1Score, player2Score);
					(new model.Hit(input.x, input.y, new Date(), activeGame.gameId, activeGame.username)).save();
				}
			}
		});
	}
});

