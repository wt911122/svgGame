var game = window.game || {};
var util = window.util || {};
var resource = window.resource || {};
var weapon = window.weapon || {};

(function(window, game, util, resource, weapon){
	weapon.weaponStore = {
		weapon_direct: {
			sprite: "weapon_direct",
			bullet: {
				sprite: "bullet_direct",
				speed: 300,
				offsetX: 0,
				offsetY: -60, 
			},
			power: 1,
			range: 1,
			frequency: 500,
			cost: 1,
			attackMode: 'DIRECT'
		},


	}
	weapon.get = (function(){
		var getWeapon = function(which){
			return new getWeapon.fn.init(which);
		}
		getWeapon.fn = getWeapon.prototype = {
			construct: getWeapon,
			init: function(which){
				if (!which || !weapon.weaponStore[which])
					throw "no such weapon in store";
				let obj = weapon.weaponStore[which];
				for(var item in obj){
					if (obj.hasOwnProperty(item)) {
						this[item] = obj[item];
					}
				}
				this.sprite = new game[this.sprite]()
				return this;
			},
			settle_down: function(tile){
				this.sprite.Position(tile.position);
				tile.construction = this;
				this.rangeTILE = [];
				this.attackMode = this[this.attackMode]();

				this.getRange(tile);
			},
			withinRange: function(pos){
				return Array.prototype.some.call(this.range, function(element, index, array){
					return element.position.x === pos.x && element.position.y === pos.y;
				})
			},
			DESTROY: function(){
				this.sprite.DESTROY();
			}
		}

		getWeapon.extend = getWeapon.fn.extend = function(obj){
			for(var func in obj){
				if(getWeapon.prototype.hasOwnProperty(func))
					throw "interface '"+ func +"' exist please replace function name"
				getWeapon.fn[func] = getWeapon.prototype[func] = obj[func];
			}
		}

		getWeapon.extend({
			DIRECT: function(){
				this.getRange = function(tile){
					let tiles = [],
						pos = tile.position,
						range = this.range,
						row = game.settings.row,
						col = game.settings.col;

					for(var i = pos.x-range < 0?0: pos.x-range; i <= (pos.x+range >= col-1?col-1: pos.x+range); i++){
						for(var j = pos.y-range < 0?0: pos.y-range; j <= (pos.y+range >= row-1?row-1: pos.y+range); j++){
							if(game.TILES[i][j].routeTile){
								tiles.push(game.TILES[i][j]);
							}
						}
					}
					console.log(tiles);
					this.range = tiles;
				}
				this.attackable = function(enemy){
					var path = game.map[game.map.choice].path;
					return !enemy.escape && enemy.health > 0 && this.withinRange(path[enemy.checkpoint]);
				}
				this.watch = function(canvas){
					this.watchField = canvas;
					
					var	span = this.frequency,
						LastTime = 0,
						self = this,
						animate = new util.animationEngine(function(timestamp){

							if(timestamp >= LastTime + span){
								if(self.targetEnemy && self.attackable(self.targetEnemy)) {
									console.log("attack target")
									self.attack();
									LastTime = timestamp;
								}else if(game.enemies.length > 0){
									for(var i = 0; i < game.enemies.length ; i++){
										var enemy = game.enemies[i];
										if(self.attackable(enemy)){
										//	console.log(path[enemy.checkpoint])
											self.targetEnemy = enemy
										//	console.log("attack new");
											self.attack();
											LastTime = timestamp;
											break;
										}
									}
								}
							
							}
							return true;
						},function(){
							// end response
						});
						animate.start();
				}
				this.attack = function(){
					var LastTime = 0,
						bullet = this.bullet,
						sprite = new game.bullet(bullet.sprite),
						target = this.targetEnemy,
						self = this,
						PosFrom = game.sprite.prototype.PositionToCoordinate.call(null, this.sprite.position.x, this.sprite.position.y);
					//console.log(target);
					sprite.PositionActual({
						CoX:PosFrom.CoX + bullet.offsetX,
						CoY:PosFrom.CoY + bullet.offsetY
					});
						
					var	animate = new util.animationEngine(function(timestamp){
							if(!LastTime){
								LastTime = timestamp;
							}else{
								let TO = target.sprite.PositionInFact;
								let span_T = timestamp - LastTime;
								let distance = bullet.speed / 1000*span_T;
						
								let FROM = sprite.PositionInFact;
								let span_X = TO.CoX - FROM.CoX;
								let span_Y = TO.CoY - FROM.CoY; 
						
								let scale = distance / Math.sqrt(Math.pow(span_X, 2) + Math.pow(span_Y, 2))
								
								let actual_span_X = span_X * scale;
								let actual_span_Y = span_Y * scale;

								sprite.PositionActual({
									CoX: FROM.CoX + actual_span_X,
									CoY: FROM.CoY + actual_span_Y
								})

								LastTime = timestamp;
								if( Math.abs(FROM.CoX - TO.CoX) < 10 && Math.abs(FROM.CoY - TO.CoY) < 10){
									return false;
								}
							}
							return true;
						},function(){
							sprite.DESTROY();
							//console.log("attack")
							//console.log(self.power, target.health)
							target.health -= self.power;
						}); 
						this.watchField.appendChild(sprite.SVG_Obj)
						animate.start();
				}
			}
		});


		getWeapon.fn.init.prototype = getWeapon.fn;
		return getWeapon;
	})();
	//console.log(weapon.get);
})(window, game, util, resource, weapon)