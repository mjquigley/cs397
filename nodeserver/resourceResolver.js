var fs = require('fs');		

exports.mimeTypes = {
	'html'		: "text/html",
	'css'		: "text/css",
	'js'		: "text/javascript",
	'.default' 	: "text/html"
}

exports.resolveType = function (filename){
	var splitString = filename.split('.');
	var extension = splitString[splitString.length - 1];
	if (exports.mimeTypes[extension]){
		return exports.mimeTypes[extension];
	} else {
		return exports.mimeTypes['.default'];
	}
}

exports.loadResource = function (filename, request, response){
	fs.exists(filename, function (exists){
		if (!exists){
			console.log("file not found: " + filename);
			return exports.pageNotFound(request, response);
		}
		response.writeHead(200, {"Content-Type": exports.resolveType(filename)});
		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(response);
	});
}

exports.pageNotFound = function (request, response){
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write("404 Page not Found!");
	response.end();
}