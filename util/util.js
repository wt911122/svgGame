var util = window.util || {};
(function(window, util){
	util.point = function(x, y){
		return {
			x: x, 
			y: y
		}
	}
	util.point.prototype.add = function(point){
		return {
			x: this.x + point.x,
			y: this.y + point.y
		}
	}
	util.xmlns = "http://www.w3.org/2000/svg";

	util.SVG_DOM = (function(){
		var SVG_DOM = function(selector){
			return new SVG_DOM.fn.init(selector);
		}
		SVG_DOM.fn = SVG_DOM.prototype = {
			name: "SVG_DOM",
			constructor: SVG_DOM,

			init: function(selector){
				if ( !selector ) {
					return this;
				}
				this.elem = document.createElementNS(util.xmlns, selector);
				return this
			},
			attr: function(attrs){
				for(var item in attrs){
					this.elem.setAttributeNS(null, item, attrs[item])
				}
				return this;
			},
			append: function(elem){
				if (elem instanceof SVG_DOM){
					this.elem.appendChild(elem.elem);
				}
				return this;
			},
			appendTo: function(elem){
				if (elem instanceof SVG_DOM){
					elem.elem.appendChild(this.elem);
				}
				return this;
			}
		}
		SVG_DOM.fn.init.prototype = SVG_DOM.fn;
		return SVG_DOM;
	})()
})(window, util)
	