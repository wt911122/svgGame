var game = window.game || {};
var util = window.util || {};
var resource = window.resource || {};

(function(window, gm, util, resource){
	let pt = util.point;
//	let SVG_DOM = util.SVG_DOM;
	/*
	settings: 
		|- position: util.point
	*/
	var sprite = gm.sprite = function(){};
	sprite.prototype = {
		Position: function(value){
			this.position = value;
			var Cood = this.PositionToCoordinate();
			this.SVG_Obj.setAttributeNS (null, "transform", "translate("+ Cood.CoX+", "+Cood.CoY+")");
		},
		PositionActual: function(value){
			this.SVG_Obj.setAttributeNS (null, "transform", "translate("+ value.CoX+", "+value.CoY+")");
		},
		PositionToCoordinate: function(x, y){
			return {
				CoX: gm.settings.width/2 - (typeof x === 'number'?x:this.position.x)*gm.settings.dx + (typeof y === 'number'?y:this.position.y)*gm.settings.dx,
				CoY: gm.settings.padding + gm.settings.dy+ (typeof y === 'number'?y:this.position.y)*gm.settings.dy + (typeof x === 'number'?x:this.position.x)*gm.settings.dy 
			}
		},
		addEventListener: function(whose, type, listener){
			whose.SVG_Obj.addEventListener(type, listener.bind(whose));
		},
		removeEventListener: function(whose, type, listener){
			whose.SVG_Obj.removeEventListener(type, listener.bind(whose));
		},
		appendVirtureChild: function(sprite, relatedPos){
			if(!this.childlist) this.childlist = [];
			if(sprite instanceof gm.sprite){
				this.childlist.push(sprite);
				sprite.relatedPos = relatedPos;
				sprite.parent = this;
			}
		},
		removeVirtureChild: function(sprite){
			if(!this.childlist) return;
			if(sprite instanceof gm.sprite){
				Array.prototype.splice.call(this.childlist, this.childlist.indexOf(sprite), 1);
			}
		},
		SHOW: function(){
			var self = this;
			if(this.childlist)
				Array.prototype.forEach.call(this.childlist, function(element, index, array){
					//console.log(element);
					element.SHOW(self);
				});
		},
		HIDE: function(){
			if(this.childlist)
				Array.prototype.forEach.call(this.childlist, function(element, index, array){
					element.HIDE();
				});
		},
		DESTROY: function(){
			this.SVG_Obj.remove();
		}
	}

	;(gm.tile = function(x, y, routeTile){
		//console.log('createtile')
		this.position = util.point(x, y);
		this.construction = undefined;
		this.routeTile = routeTile;
		//this.width = gm.settings.dx*2;
		//this.height = gm.settings.dy*2;
		var Cood = this.PositionToCoordinate();
		this.SVG_Obj = resource.factory('tile', Cood, routeTile);

	}).prototype = Object.create(sprite.prototype);


	/*************************
		面板
	**************************/
	;(gm.optionPanel = function(id){
		this.SVG_Obj = resource.factory('optionPanel', id);
		this.SHOW = function(tile){
			console.log(id + "Panel show")
			this.tempTile = tile;
			this.Position.call(this, tile.position);
			this.SVG_Obj.setAttributeNS(null, 'class', 'show-pattern');
			// 调用父原型函数
			sprite.prototype.SHOW.call(this);
		}
		this.HIDE = function(){
			this.SVG_Obj.setAttributeNS(null, 'class', 'hide-pattern');
			// 调用父原型函数
			sprite.prototype.HIDE.call(this);
		}
	}).prototype = Object.create(sprite.prototype);
	
	;(gm.optionPanelBtn = function(id, url, additionalConfig){
		this.SVG_Obj = resource.factory("Panel_Btn_SVG", id, url, additionalConfig);
		this.SHOW = function(container){
			var cood = sprite.prototype.PositionToCoordinate.call(container);
			//console.log(cood);
			this.PositionActual.call(this, {
				CoX: cood.CoX + this.relatedPos.x,
				CoY: cood.CoY + this.relatedPos.y
			});
			this.SVG_Obj.setAttributeNS(null, 'class', 'show-pattern');
			// 调用父原型函数
			sprite.prototype.SHOW.call(this);
		}
		this.HIDE = function(){
			this.SVG_Obj.setAttributeNS(null, 'class', 'hide-pattern');
			// 调用父原型函数
			sprite.prototype.HIDE.call(this);
		}
	}).prototype = Object.create(sprite.prototype);



	;(gm.weapon_1 = function(tile){
		this.SVG_Obj = resource.factory('weapon_1');
		this.Position.call(this, tile.position);
	}).prototype = Object.create(sprite.prototype);

	;(gm.enemy = function(which){
		this.SVG_Obj = resource.factory("enemy", which);
		this.Position.call(this, {x: 0, y: -1});
	}).prototype = Object.create(sprite.prototype);

})(window, game, util, resource);



















