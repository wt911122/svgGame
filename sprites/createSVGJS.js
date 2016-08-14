this.createSVGjs = this.createSVGjs || {};


(function(){
	createSVGjs.extend = function(subclass, superclass) {
		"use strict";

		function o() { this.constructor = subclass; }
		o.prototype = superclass.prototype;
		return (subclass.prototype = new o());
	};
	createSVGjs.UID = (function(){
		var id = 1;
		return {
			get: function(){
				return id++;
			}
		}
	}());
}());

(function(){
	"use strict";

	var Event = function(type, bubbled, cancelable){
		// 事件的类型 
		this.type = type;
		// 事件的传播类型
		this.bubble = !!bubble;
		this.cancelable = !!cancelable;
		this.defaultPrevented = false;
		this.propagationStoped = false;
		this.removed = false;
	}
	var p = Event.prototype;
	p.preventDefault = function(){
		this.defaultPrevented = true;
	}
	p.stopPropagation = function(){
		this.propagationStoped = true;
	}
	p.toString = function(){
		return "[Event "+this.type+"]";
	}
	createSVGjs.Event = Event;
}());

(function(){
	var EventDispatcher = function(){
		this._listeners = null;

		this._captureListeners = null;
	}
	var p = EventDispatcher.prototype;
	p.addEventListener = function(type, listener, useCapture){
		var listener = !!useCapture ? 
			this._captureListeners = this._captureListeners||{} : 
			this._listeners = this._listeners||{};

		var arr = listener[type];
		if(arr) {
			this.removeEventListener(type, listener, useCapture);
			arr.push(listener);
		}
		else arr = [listener];
		return listener;
	}
    p.removeEventListener = function(type, listener, useCapture){
    	var listener = !!useCapture ? this._captureListeners: this._listeners;
    	if(!listener) return;
    	var arr = listener[type];
    	if(!arr) return;
    	for(var i=0; i<arr.length; i++){
    		if(arr[i] === listener){
    			arr.splice(i, 1);
    			break;
    		}
    	}
    }
    p.removeAllEventListner = function(type){
    	if(!type) this._listeners = this._captureListeners = null;
    	else {
    		delete this._listeners[type];
    		delete this._captureListeners[type];
    	}
    }
    p.dispachEvent = function(eventObj, bubbles, cancelable){
    	
    }
    createSVGjs.EventDispatcher = EventDispatcher;
}());

(function(){
	var DisplayObject = function(){
		this.parent = null;
		this.id = createSVGjs.UID.get();
		// regX, regY 相对于整个svg
		this.regX = 0;
		this.regY = 0;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		// x, y 相对于 父元素
		this.x = 0;
		this.y = 0;
	}


}());

(function(){
	var Container = function(element){
		this.element = element;
		this._children = [];
		// enable child click event
		this.mouseChildren = true;
	}
	var p = createSVGjs.extend(Container, createjs.EventDispatcher);

	p.isVisible = function(){
		return this._children.length && this.visible;
	}

	p.addChild = function(child){
		if(child == null) return child;

		Array.prototype.forEach.call(arguments, function(child){
			if(child.parent) child.parent.removeChild(child);
			child.parent = this;
			this._children.push(child);
			child.dispatchEvent("added");
		}.bind(this))
	}

	p.removeChild = function(child){
		if(child == null) return child;
		for(var i=0, temp;temp = this._children[i];i++){
			if(child === temp){
				child.parent = null;
				this._children.splice(i, 1);
				child.dispatchEvent("removed");
				return true;
			}
		}
		return false;
	}

	

	createSVGjs.Container = Container;


}());

(function(){
	var DOMSVG = function(selector){
		return new DOMSVG.fn.init(selector);
	}
	DOMSVG.prototype = DOMSVG.fn = {
		constructor: DOMSVG,
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
	DOMSVG.fn.init.prototype = DOMSVG.fn;

	createSVGjs.$ = DOMSVG;
}());





//module.exports = this.createSVGjs;