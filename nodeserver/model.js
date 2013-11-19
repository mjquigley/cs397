exports.db = require('mongojs').connect('cs397', ['hits']);		//mongoDB module

//Save coordinate to mongodb
exports.saveCoordinate = function (x, y){
	exports.db.hits.save({x: x, y: y, timestamp: new Date()}, function(error, saved){
		if (error || !saved){
			console.log("Error saving coordinate:  " + error );
		} else {
			console.log("Coordinate saved to database");
		}
	});
}