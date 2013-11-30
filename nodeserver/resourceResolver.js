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
	splitString.pop();
	var base = splitString.join('.');
	if (exports.mimeTypes[extension]){
		return exports.mimeTypes[extension];
	} else {
		return exports.mimeTypes['.default'];
	}
}
exports.getScriptForResource = function(filename){
	var splitString = filename.split('.');
	splitString.pop();
	var base = splitString.join('.');
	base = base.replace('./', '');
	return "./resources/" + base + ".js";
}

exports.loadResource = function (filename, request, response){
	var resourceScript = exports.getScriptForResource(filename);
	fs.exists(resourceScript, function(exists){
		if (!exists){
			fs.exists(filename, function (exists){
				if (!exists){
					console.log("file not found: " + filename);
					return exports.pageNotFound(request, response);
				}

				response.writeHead(200, {"Content-Type": exports.resolveType(filename)});
				var fileStream = fs.createReadStream(filename);
				fileStream.pipe(response);
		});
		} else {
			require(resourceScript).run(filename, request, response);	
		}
	});
	

}

exports.pageNotFound = function (request, response){
	response.writeHead(404, {"Content-Type": "text/html"});
	response.write("404 Page not Found!");
	response.end();
}