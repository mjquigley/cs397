var spawn = require('child_process').spawn;				//process spawning module
var socketServer = require('./socketServer.js');		//Import and start websocket server
var httpServer = require('./httpServer.js').server;		//Import and start http server
var model = require('./model.js');

//Listen for new coordinates from serial input
var serialInput = spawn ('node', ['sampleReciever.js']);

serialInput.stdout.on('data', function(data){
	var input = JSON.parse(data);
	if (input.x && input.y){
		socketServer.sendCoordinate(input.x, input.y);
		model.saveCoordinate(input.x, input.y);
	}
});

