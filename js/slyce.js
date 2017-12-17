/*
Faire une rotation quand on clique ?
Faire qu'un clique affiche la zone voulue ?
*/

$(document).ready (function () {
'use strict';
//Réglages
var explodeTime = 1000,
restoreTime = 500;

var paper = new Snap('#passion-svg');
paper.attr({
	viewbox: '0 0 '+$(window).width()+' 800',
	width: window.innerWidth,
    height: parseInt($('.passion').css('height'))
});

var g = paper.group();
var gLogo = paper.group();
var gSep0 = paper.group();

Snap.load('./assets/img/activities.svg', function (m) {
	g.add(m);
	var scale = 1.4;
	
	
	var img = paper.select('#imgMenu');
	img.attr({
		viewBox : '-150 -100 800 760',
	});

	var imgWidth = 502;

	var posX = ( (window.innerWidth/2) - (imgWidth * scale / 2) );
	console.log( window.innerWidth + " bbox " + g.getBBox().width );
	var posY = 130;//( (window.innerHeight/2) - (g.getBBox().height * scale / 2) ) + 20;

	g.transform('s'+scale+'T'+Math.round(posX)+','+Math.round(posY));

	prepareShape ('Shape1Area', 'Shape1Content');
	prepareShape ('Shape2Area', 'Shape2Content');
	prepareShape ('Shape3Area', 'Shape3Content');
	prepareShape ('Shape4Area', 'Shape4Content');
	prepareShape ('Shape5Area', 'Shape5Content');
	//g.transform('t100,20');
});

Snap.load('./assets/img/sep0.svg', function (l) {
	gSep0.add(l);
	var imgWidth = gSep0.getBBox().width;
	var img = paper.select('#Sep0');
	/*img.attr({
		viewBox : '0 0 '+ (window.innerWidth) +' 120',
	});
	*/
	//Math.round(num * 100) / 100://
	var scale = 1;
	var scaleX = Math.round( ( ( window.innerWidth  ) / gSep0.getBBox().width ) * 1000) / 1000 + 0.1;
	var scaleY = Math.round( ( 250 / gSep0.getBBox().height ) * 1000) / 1000;
	//console.log(scaleX + " inner "+ window.innerWidth +" "+ gSep0.getBBox().width);
	var m = new Snap.Matrix();

	var posX = 0; //( (window.innerWidth/2) - (gSep0.getBBox().width * scale / 2) );
	var posY = ( parseInt($('.passion').css('height')) - 240 ) ;//(gSep0.getBBox().height * scale ) );
	
	m.translate(posX,posY);
	m.scale(scaleX,scaleY);

	gSep0.transform(m);

});

Snap.load('./assets/img/logo.svg', function (l) {
	gLogo.add(l);
	paper.append(gLogo);
	var imgWidth = gLogo.getBBox().width;
	var scale = 1.3;

	var posX = ( (window.innerWidth/2) - (gLogo.getBBox().width * scale / 2) + 40);
	var posY = ( parseInt($('.passion').css('height')) - (gLogo.getBBox().height * scale ) ) - 30;

	//console.log('posY '+posY );
	gLogo.transform('s'+scale+'T'+Math.round(posX)+','+Math.round(posY));

	var logo = prepareShape ('LogoArea', 'LogoContent');

	loopSlice(logo);
});

var listShapes = [];

function Polygon (poly, origin) {
	var thisPoly = this;
	this.poly = poly;

	var pBox = poly.getBBox();

	this.origin = origin;

	this.pos = {
		x: pBox.cx,
		y: pBox.cy,
		progress: 0,
		targetX: (this.origin.x - pBox.cx) * -0.6,
        targetY: (this.origin.y - pBox.cy) * -0.6,
	};

	this.explode = function (time) {
		poly.transform('');
		if(time === undefined || time === null) {
			time = explodeTime;
		}

	    poly.currentAnim = Snap.animate( thisPoly.pos.progress, 1, function( value ) {
	        var newX = thisPoly.pos.targetX * value ;
	        var newY = thisPoly.pos.targetY * value ;
	        poly.transform('t'+newX+','+newY);   
	        thisPoly.pos.x = newX;
	        thisPoly.pos.y = newY;
	        thisPoly.pos.progress = value;
	    }, (1-thisPoly.pos.progress) * time, mina.easeinout);
	};

	this.restore = function (time) {
		if(time === undefined || time === null) {
			time = restoreTime;
		}

		poly.stop();
		var anim = poly.currentAnim;
        delete poly.currentAnim;
        if(anim){anim.stop();}
		
		Snap.animate( thisPoly.pos.progress, 0, function( value ) {
	        var newX = thisPoly.pos.targetX * value ;
	        var newY = thisPoly.pos.targetY * value ;
	        poly.transform('t'+newX+','+newY);   
	        thisPoly.pos.x = newX;
	        thisPoly.pos.y = newY;
	        thisPoly.pos.progress = value;
	    }, thisPoly.pos.progress * time, mina.easeinout);
	};

	this.setShapeOrigin = function (myOrigin) {
		this.origin = myOrigin;
	};
}

function Shape (shapeCover, shapeMore) {
	var listPolygons = [];
	var thisShape = this;

	var box = shapeMore.getBBox();
	
	var origin = {
		x : box.cx,
		y : box.cy,
	};

	//Prepare polygons
	$(shapeMore.selectAll('polygon')).each(function(i) {
		var obj = new Polygon (this, origin);
		obj.setShapeOrigin(origin);
		listPolygons[i] = obj;
	});
	$(shapeMore.selectAll('path')).each(function() {
		var obj = new Polygon (this, origin);
		obj.setShapeOrigin(origin);
		listPolygons[listPolygons.length] = obj;
	});
	$(shapeMore.selectAll('rect')).each(function() {
		var obj = new Polygon (this, origin);
		obj.setShapeOrigin(origin);
		listPolygons[listPolygons.length] = obj;
	});
	$(shapeMore.selectAll('polyline')).each(function() {
		var obj = new Polygon (this, origin);
		obj.setShapeOrigin(origin);
		listPolygons[listPolygons.length] = obj;
	});

	this.explode = function (time, callback) {
		if(time === undefined || time === null) {
			time = explodeTime;
		}

		$(listPolygons).each(function () {
			this.explode(time);
		});

		if (typeof callback === 'function') {
			setTimeout(function () {
				callback(thisShape, time);
			}, time);
		}
	};

	this.restore = function (time, callback) {
		if(time === undefined || time === null) {
			time = restoreTime;
		}

		$(listPolygons).each(function () {
			this.restore(time);
		});

		if (typeof callback === "function") {
			setTimeout(function () {
				callback(thisShape, time);
			}, time);
		}
	};

	shapeCover.hover(
		function () { thisShape.explode(); },
		function () { thisShape.restore(); }
	);
}


var prepareShape = function (shapeIdCover, shapeIdMore) {
	var shapeCover = paper.select('#'+shapeIdCover);
	var shapeMore = paper.select('#'+shapeIdMore);

	var obj = new Shape (shapeCover, shapeMore);
		listShapes[listShapes.length] = obj;

	return obj;
};


var explode = function (element, origin) {
	element.transform('');
	pBox = element.getBBox();
		var pol = {
			newX: (origin.x - pBox.cx) * -2,
			newY: (origin.y - pBox.cy) * -2,
			oldX: pBox.cx,
			oldY: pBox.cy,
		};
	var angle = (Math.random() -0.5) * 360;
	Snap.animate( 0, 1, function( value ) {
		newX = pol.newX * value ;
		newY = pol.newY * value ;
		element.transform('t'+newX+','+newY+'r'+angle*value);                           
        element.attr({ 'opacity': 1-value }); 
    }, 300, mina.easeout);
};

var fadeIn = function (element) {
	Snap.animate( 0, 1, function( value ) {  
		element.transform('');                        
        element.attr({ 'opacity': value }); 
    }, 300, mina.easeout, function () {
    });
};

function restoreCallback (el, time) {
	el.restore(time, explodeCallback);
}

function explodeCallback (el, time) {
	el.explode(time, restoreCallback);
}

var loopSlice = function (el) {
	el.explode(4000, restoreCallback);
};

});