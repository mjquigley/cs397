/*----------------Establish Websockets----------*/
var WebSocketServer = require('ws').Server;			//websocket module

exports.wss = new WebSocketServer({port : 8001});
exports.wss.broadcast = function(data){
	data = JSON.stringify(data);
	for (var i in this.clients){
		this.clients[i].send(data);
	}
}
exports.sendData = function(x, y, score1, score2){
	console.log("Broadcasting Coordinate: (" + x + ", " + y + ") score1: "+score1+" | score2: "+score2+".")
	exports.wss.broadcast({x : x, y : y, score1: score1, score2: score2});
}