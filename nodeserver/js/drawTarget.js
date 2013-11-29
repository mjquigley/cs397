var MARKER_RADIUS = 7;
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
}
Target.prototype.addHit = function(x, y, player){
	this.hits.push(new HitMarker(x, y, this.playerColors[player], this.paper));
}

var target;
window.onload = function() {
	target = new Target();
}