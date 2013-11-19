/*----------------Establish Websockets----------*/
var WebSocketServer = require('ws').Server;			//websocket module

exports.wss = new WebSocketServer({port : 8001});
exports.wss.broadcast = function(data){
	data = JSON.stringify(data);
	for (var i in this.clients){
		this.clients[i].send(data);
	}
}
exports.sendCoordinate = function(x, y){
	console.log("Broadcasting Coordinate: (" + x + ", " + y + ").")
	exports.wss.broadcast({x : x, y : y});
}