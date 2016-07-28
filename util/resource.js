var util = window.util || {};
var resource = window.resource || {};

(function(window, util, res){
	var $ = util.SVG_DOM;
	res.factory = function(item){
		return res[item].apply(window, Array.prototype.slice.call(arguments, 1));
	}
	res.canvas_svg = function(width, height){
		var canvas_svg = document.createElementNS (util.xmlns, "svg");
		canvas_svg.setAttributeNS('http://www.w3.org/2000/svg','xlink','http://www.w3.org/1999/xlink');
		canvas_svg.setAttributeNS (null, "viewBox", "0 0 " + width + " " + height);
        canvas_svg.setAttributeNS (null, "width", width);
        canvas_svg.setAttributeNS (null, "height", height);
        return canvas_svg;
	}
	res.net = function(width, height, padding, dx, dy){
		var net = document.createElementNS (util.xmlns, "path");
		
		var pathd = "";
		for (var i = padding, j=height/2, p=width/2, k=padding; i <= width / 2; i+=dx,j +=dy, p+=dx, k+=dy){
			pathd += ["M", i, j, "L", p, k, ''].join(" ");
		}
		for (var i = padding, j=height/2, p=width/2, k=height-padding; i <= width / 2; i+=dx,j -=dy, p+=dx, k-=dy){
			pathd += ["M", i, j, "L", p, k, ''].join(" ");
		}
		net.setAttributeNS (null, 'stroke', "#000000");
        net.setAttributeNS (null, 'stroke-width', 1);
        net.setAttributeNS (null, 'stroke-dasharray', "7 3");
        net.setAttributeNS (null, 'stroke-linejoin', "miter");
		net.setAttributeNS (null, 'd', pathd);
		return net;
	}
	res.tile = function(Cood, routeTile){
		var tile = document.createElementNS(util.xmlns, "polyline");
        tile.setAttributeNS(null, 'points', "-60 0, 0 -30,60 0, 0 30");
		tile.setAttributeNS (null, "transform", "translate("+ Cood.CoX+", "+Cood.CoY+")");
		tile.setAttributeNS (null, "fill", routeTile ? "rgba(255,255,255,0.3)": "transparent");
		tile.setAttributeNS (null, "cursor", routeTile ? "default":"pointer");
		return tile;
	}
	res.optionPanel = function(id){
		var buildingPanel = $('circle').attr({
			id: id,
			cx: 0,
			cy: 0,
			r: 0,
			fill:"rgba(255,255,255,0.3)" 
		})
		return buildingPanel.elem;
	}
	res.cross = function(){
		var defs = $("defs");

		var rg_btn_shadow = $('radialGradient').attr({id: "btn_shadow"})
		var stop1 = $('stop');
		stop1.attr({
			offset: "80%",
			style: "stop-color: rgba(0,0,0,0.5)"
		}).appendTo(rg_btn_shadow);
		var stop2 = $('stop').attr({
			offset: "100%",
			style: "stop-color: white"
		}).appendTo(rg_btn_shadow);
		defs.append(rg_btn_shadow);

		var rg_btnGradient = $('radialGradient').attr({id:"btnGradient"});
		stop1 = $('stop').attr({
			offset: "60%",
			style: "stop-color: red"
		}).appendTo(rg_btnGradient)
		stop2 = $('stop').attr({
			offset: "100%",
			style: "stop-color: rgba(255,0,0,0.6)"
		}).appendTo(rg_btnGradient)
		defs.append(rg_btnGradient);

		var pattern_cross_sign = $("pattern").attr({
			id: "cross_sign",
			patternUnits: "objectBoundingBox",
			patternContentUnits: "objectBoundingBox",
			x: 0,
			y: 0,
			width: 1, 
			height: 1,
			stroke: "white",
			"stroke-width": 0.1
		});
		var circle = $("circle").attr({
			cx: 0.5,
			cy: 0.5,
			r: 0.5,
			fill: "url(#btn_shadow)",
			stroke: "none"
		}).appendTo(pattern_cross_sign);
		circle = $("circle").attr({
			cx: 0.5,
			cy: 0.5,
			r: 0.45,
			fill: "url(#btnGradient)",
			stroke: "none"
		}).appendTo(pattern_cross_sign);
		var line = $('line').attr({
			x1: 0.32,
			y1: 0.68, 
			x2: 0.68,
			y2: 0.32
		}).appendTo(pattern_cross_sign);
		var line = $('line').attr({
			x1: 0.32,
			y1: 0.32, 
			x2: 0.68,
			y2: 0.68
		}).appendTo(pattern_cross_sign);

		defs.append(pattern_cross_sign);
		return defs.elem;
	}
	res.Panel_Btn_SVG = function(id, url, additionalConfig){
		if (additionalConfig && typeof additionalConfig !== "object") throw "need config to be object";
		var btn = $("circle").attr(Object.assign({
			id: id,
			cx: 0,
			cy: 0,
			r:  0,
			fill: "url(#"+url+")",
			cursor: "pointer"
		}, additionalConfig));
		return btn.elem;
	}
	res.weapon_1_image = function(){
		var defs = $("defs");
		var patternImage = $('pattern').attr({
			id: "weapon_1_image",
			x: 0,
			y: 0,
			height: 1,
			width: 1,
			patternUnits: "objectBoundingBox",
			patternContentUnits: "objectBoundingBox"
		}).appendTo(defs);
		var image = $("path").attr({
			d:  "M0.205,1h0.596V0.96H0.755V0.942H0.739l0-0.003C0.74,0.938,0.74,0.936,0.74,0.935 "+ 
	"c0-0.019-0.068-0.035-0.165-0.042V0.388l0.02-0.022v-0.01L0.543,0.345V0.242l0.008-0.013L0.543,0.223V0.208L0.517,0.194H0.516 "+ 
	"L0.515,0.147c0,0,0.004-0.006,0.004-0.01C0.518,0.132,0.503,0.128,0.503,0.128V0.085L0.478,0.051L0.452,0.083v0.038H0.446 "+ 
	"L0.446,0.019L0.436,0L0.427,0.02L0.424,0.194H0.423L0.4,0.225l0.007,0.008v0.118L0.383,0.37H0.371v0.01L0.36,0.388l0.011,0.003 "+ 
	"v0.502C0.275,0.9,0.207,0.916,0.207,0.935c0,0.001,0,0.002,0,0.003L0.205,1z M0.529,0.436h0.019V0.49H0.529V0.436z M0.529,0.555 "+ 
	"h0.019v0.054H0.529V0.555z M0.529,0.675h0.019v0.054H0.529V0.675z M0.529,0.795h0.019v0.054H0.529V0.795z M0.472,0.436h0.019V0.49 "+ 
	"H0.472V0.436z M0.472,0.555h0.019v0.054H0.472V0.555z M0.472,0.675h0.019v0.054H0.472V0.675z M0.472,0.795h0.019v0.054H0.472V0.795z "
		});
		image.appendTo(patternImage);
		return defs.elem;
	}
	res.shovel_image = function(){
		var defs = $("defs");
		var patternImage = $('pattern').attr({
			id: "shovel_image",
			x: 0,
			y: 0,
			height: 1,
			width: 1,
			patternUnits: "objectBoundingBox",
			patternContentUnits: "objectBoundingBox"
		}).appendTo(defs);
		var image = $('path'). attr({
			d: "M0.981,0.155l-0.14-0.142c-0.027-0.027-0.072-0.026-0.1,0.002 "+
		"c-0.003,0.003-0.005,0.006-0.006,0.01C0.7,0.167,0.701,0.217,0.707,0.236L0.315,0.633l-0.12-0.121L0.052,0.657 "+
		"c-0.047,0.047-0.086,0.22-0.005,0.303c0.081,0.082,0.252,0.042,0.298-0.005l0.144-0.145L0.371,0.69l0.393-0.398 "+
		"c0.021,0.005,0.072,0.004,0.205-0.03c0.004-0.001,0.007-0.003,0.01-0.006C1.007,0.228,1.008,0.182,0.981,0.155L0.981,0.155z "+
		"M0.945,0.215c-0.069,0.02-0.149,0.037-0.167,0.034L0.751,0.221C0.747,0.204,0.764,0.122,0.784,0.052 "+
		"c0.011-0.008,0.026-0.009,0.035,0L0.945,0.18C0.953,0.189,0.953,0.203,0.945,0.215L0.945,0.215z"
		})
		image.appendTo(patternImage);
		return defs.elem;
	}

	res.weapon_1 = function(){
		var weapon_1 =  $("rect").attr({
			x: -50,
			y: -90,
			width: 100,
			height: 100,
			stroke: "none",
			fill: "url(#weapon_1_image)",
			cursor: "pointer"
		});
		return weapon_1.elem;
	}
	res.enemy = function(){
		var enemy = $("")
	}
	/*res.updatePanel_shovel = fucntion(){
		var updatePanel_shovel = $()
	}*/

})(window, util, resource)