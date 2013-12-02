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
			model.getScores(currentSession.gameId, function(score1, score2){
				if (!score1) score1 = 0;
				if (!score2) score2 = 0;
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
							<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
						    <script src="/js/jquery.min.js"></script>
							<script type='text/javascript'>
					***/
				});
				homePage = homePage + "var gameData = JSON.parse('"+gameData+"');\n"
				homePage = homePage + "var host = window.document.location.host.replace(/:.*/, '');\n"
				homePage = homePage + M(function(){
					/***
					var ws = new WebSocket('ws://' + host + ':8001');
								ws.onmessage = function (event) { 
									console.log(event);
									console.log(JSON.parse(event.data));
									var data = JSON.parse(event.data);
									target.addHit(data.x, data.y, 0);
									if (data.score1){
										$(".score1").text(data.score1);
									}
									if (data.score2){
										$(".score2").text(data.score2);
									}
								}
								window.onbeforeunload = function(){
									ws.onclose = function(){}
								}
							</script>
						</head>
						<body>
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
							              <li class="active"><a href="/">Home</a></li>
							              <li><a href="/login.html">Login</a></li>
							          ***/});
										homePage = homePage + "<li>Player 1: "+currentSession.username+" - <span class='score1'>"+score1+"</span> points</li>";
							          	homePage = homePage + M(function(){
										/***
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
	});
}