exports.run = function(filename, request, response){
	var model = require('../model.js');
	var cookieList = {};
	var cookies = request.headers.cookie;
	    cookies && cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookieList[parts.shift().trim()] = unescape(parts.join('='));
    });
	model.Session.fromId(model.stringToId(cookieList.sessionId), function(currentSession){
		model.Hit.fromDB(currentSession ? currentSession.gameId :  -1, null, function(hits){
			var gameData = [];
			if (hits){
				gameData = JSON.stringify(hits);
			}
			var M = require('mstring');
			var homePage = M(function(){
			  	/***
				<!DOCTYPE HTML>
				<html>
					<head>
						<title>Target</title>
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
				    	<!-- Bootstrap -->
				    	<link href="css/bootstrap.min.css" rel="stylesheet">
						<link rel="stylesheet" href='/css/style.css' type='style/css'/>
						<script type='text/javascript' src='/js/raphael-min.js'></script>
						<script type='text/javascript' src='/js/drawTarget.js'></script>

						<script type='text/javascript'>
				***/
			});
			homePage = homePage + "var gameData = JSON.parse('"+gameData+"');\n"
			homePage = homePage + "var host = window.document.location.host.replace(/:.*/, '');\n"
			homePage = homePage + M(function(){
				/***
				document.onload = function(){
					for(var i=0; i<gameData.length; i++){
						target.addHit(gameData[i].x, gameData[i].y, 0)
					}
				}
				var ws = new WebSocket('ws://' + host + ':8001');
							ws.onmessage = function (event) { 
								console.log(event);
								console.log(JSON.parse(event.data));
								var hit = JSON.parse(event.data);
								target.addHit(hit.x, hit.y, 0);
							}
							window.onbeforeunload = function(){
								ws.onclose = function(){}
							}
						</script>
					</head>
					<body>
					    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
					    <script src="/js/jquery.min.js"></script>
					    <!-- Include all compiled plugins (below), or include individual files as needed -->
					    <script src="js/bootstrap.min.js"></script>
						<div class="page-container">
						  
							<!-- top navbar -->
						    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
						       <div class="container">
						    	<div class="navbar-header">
						           <button type="button" class="navbar-toggle" data-toggle="offcanvas" data-target=".sidebar-nav">
						             <span class="icon-bar"></span>
						             <span class="icon-bar"></span>
						             <span class="icon-bar"></span>
						           </button>
						           <a class="navbar-brand" href="#">Project Name</a>
						    	</div>
						       </div>
						    </div>
						      
						    <div class="container">
						      <div class="row row-offcanvas row-offcanvas-left">
						        
						        <!-- sidebar -->
						        <div class="col-xs-6 col-sm-3 sidebar-offcanvas" id="sidebar" role="navigation">
						            <ul class="nav">
						              <li class="active"><a href="#">Home</a></li>
						              <li><a href="#">Link 1</a></li>
						              <li><a href="#">Link 2</a></li>
						              <li><a href="#">Link 3</a></li>              
						            </ul>
						        </div>
						  	
						        <!-- main area -->
						        <div class="col-xs-12 col-sm-9">
						        	<div id='target_canvas'>
									</div> 
						        </div><!-- /.col-xs-12 main -->
						    </div><!--/.row-->
						  </div><!--/.container-->
						</div><!--/.page-container-->
					</body>
				</html>
				***/
			});
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(homePage);
		});
	});
}