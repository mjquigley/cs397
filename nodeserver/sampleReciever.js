setInterval(function(){
	console.log(JSON.stringify({x : Math.floor(Math.random()*500+1), y : Math.floor(Math.random()*500+1)}));
},10000);