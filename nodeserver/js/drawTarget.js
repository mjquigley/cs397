var MARKER_RADIUS = 15;
HitMarker = function(x, y, color, paper){
	this.mark = paper.circle(x, y, MARKER_RADIUS);
	this.mark.attr({fill: color});
}

Target = function (){
	this.paper = new Raphael(document.getElementById('target_canvas'), 500, 500);
	this.hits = new Array();
	this.playerColors = new Array();
	this.playerColors[0] = '#f00';
	this.playerColors[1] = '#00f';
	this.rings = new Array();
	this.rings.push(new Ring(this.paper, 50, 100));
	this.rings.push(new Ring(this.paper, 150, 200));
	this.rings.push(new Ring(this.paper, 250, 300));
}
Target.prototype.addHit = function(x, y, player){
	this.hits.push(new HitMarker(x, y, this.playerColors[player], this.paper));
}
function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}
Ring = function(paper, innerRadius, outterRadius){
	this.innerRadius = innerRadius;
	this.outterRadius = outterRadius;
	this.paper = paper;
	this.paper.circle(paper.width/2, paper.height/2, innerRadius).attr({'stroke': '#00F', 'stroke-width': outterRadius-innerRadius})
}
Ring.prototype.inRing = function(x, y){
	var pointRadius = distance(x,y, this.paper.width/2, this.paper.height/2);
	return (pointRadius >= innerRadius && pointRadius <= outterRadius);
}
var target;
window.onload = function() {
	target = new Target();
	for(var i=0; i<gameData.length; i++){
		target.addHit(gameData[i].x, gameData[i].y, 0)
	}
}