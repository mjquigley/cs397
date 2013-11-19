var WebSocketServer = require('ws').Server;			//websocket module
var wss = new WebSocketServer({port : 8001});
wss.broadcast = function(data){
	for (var i in this.clients){
		this.clients[i].send(data);
	}
};
function sendCoordinate(x, y){
	wss.broadcast({x : x, y : y});
}