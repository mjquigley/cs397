/*------------------Handle HTTP requests-------------------------*/
var http = require('http');						//basic http server module
var url = require('url');						//url parsing module
var fs = require('fs');							//file system module
var rr = require('./resourceResolver.js');		//file loading module

exports.server = http.createServer(function (request, response) {
	var urlpath = url.parse(request.url, true).pathname;

	if (urlpath == '/'){
		rr.loadResource('./resources/home.html', request, response);
	} 
	else {
		rr.loadResource('.'+urlpath, request, response);
	}
});

exports.server.listen(8000);	//start the http server listening on port 8000
