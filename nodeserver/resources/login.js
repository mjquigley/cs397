exports.run = function(filename, request, response){
	var qs = require('querystring');
	var M = require('mstring');
	var loginForm = M(function(){
	  	/***
		<!DOCTYPE HTML>
		<html>
			<head>
				<title>Target</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
		    	<!-- Bootstrap -->
		    	<link href="css/bootstrap.min.css" rel="stylesheet">
				<link rel="stylesheet" href="/css/style.css" type="style/css"/>
				<script type="text/javascript" src="/js/raphael-min.js"></script>
				<script type="text/javascript" src="/js/drawTarget.js"></script>
			</head>
			<body>
			    <script src="/js/jquery.min.js"></script>
			    <script src="js/bootstrap.min.js"></script>

			    <div class="container">
			    	<form class="form-signin" action="login.html" method="post">
				        <h2 class="form-signin-heading">Please sign in</h2>
				        <input type="text" name="username" class="form-control" placeholder="Username" required autofocus>
				        <input type="password" name="password" class="form-control" placeholder="Password" required>
				        <!--<label class="checkbox">
				        	<input type="checkbox" value="remember-me"> Remember me
				        </label>-->
				        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
			    	</form>
			    </div>
			</body>
		</html>
		***/
	});

	if (request.method == "GET"){
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(loginForm);
	}
	if (request.method == "POST"){
		var model = require('../model.js');
			var createSession = function(player){
			model.Session.create(player.name, player.password, function(session){
    			if (session){
	    			response.writeHead(200, {'Set-Cookie': 'sessionId='+session.id, 'Content-Type': 'text/html'});
			    	response.write('<!doctype html><html><head><title>Registration Successful</title></head><body>');
			    	response.write('Login Successful! for : '+session.username+'('+session.id+')'+'<br />');
			    	response.write('<script type="text/javascript">window.location.assign("/")</script>')
			    	response.end('</body></html>');
			    } else {
	    			console.log("error finding player");
		    		response.writeHead(200, {'Content-Type': 'text/html'});
			    	response.write('<!doctype html><html><head><title>Login Successful</title></head><body>');
			    	response.write('Login Failed');
			    	//response.write('<script type="text/javascript">window.location.assign("/index.html")</script>')
			    	response.end('</body></html>');
	    			return;
			    }
    		});
		}
		var requestBody = '';
	    request.on('data', function(data) {
	    	requestBody += data;
	    	if(requestBody.length > 1e7) {
	        	response.writeHead(413, "Request Entity Too Large", {'Content-Type': 'text/html'});
	      		response.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
	      	}
	    });
	    request.on('end', function() {
	    	var formData = qs.parse(requestBody);
	    	model.Player.fromCredentials(formData.username, formData.password, function(player){
	    		if (!player){
		    		var p = new model.Player(formData.username, formData.password);
		    		console.log(p);
		    		p.save(function(player){
	    				if (!player){
			    			console.log("error finding player");
				    		response.writeHead(200, {'Content-Type': 'text/html'});
					    	response.write('<!doctype html><html><head><title>Login Successful</title></head><body>');
					    	response.write('Login Failed');
					    	//response.write('<script type="text/javascript">window.location.assign("/index.html")</script>')
					    	response.end('</body></html>');
			    			return;
			    		} else {
			    			createSession(player);
			    		}
			    	});
		    	} else {
		    		createSession(player);
		    	}
	    	});
	    });
	}
}