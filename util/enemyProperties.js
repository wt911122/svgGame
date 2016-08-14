var game = window.game || {};
var util = window.util || {};
var resource = window.resource || {};
var enemy = window.enemy || {};

(function(window, game, util, resource, enemy){
	enemy.enemyStore = {
		enemy_level1: {
			sprite: "enemy_level1",
			health: 3,
			speed: 500
		}
	}

	enemy.get = (function(){
		var getEnemy = function(level){
			return new getEnemy.fn.init(level)
		}

		getEnemy.fn = getEnemy.prototype = {
			construct: getEnemy,
			init: function(level){
				if (!level || !enemy.enemyStore[level])
					throw "no such enemy in store";
				let obj = enemy.enemyStore[level];
				for(var item in obj){
					if (obj.hasOwnProperty(item)) {
						this[item] = obj[item];
					}
				}
				let map = game.map[game.map.choice];
				this.sprite = new game.enemy(this.sprite);
				this.sprite.position = map.path[0];
				this.checkpoint = 0;
				return this;
			},
			DESTROY: function(){
				this.sprite.DESTROY();
			},
			move: function(){
				var path = game.map[game.map.choice].path,
				    FROM = this.sprite.PositionToCoordinate(),
				    span = this.speed,
				    sprite = this.sprite,
				    self = this,
				    LastTime = 0,
					animate = new util.animationEngine(function(timestamp){
						let TO = game.sprite.prototype.PositionToCoordinate.call(null, path[self.checkpoint].x, path[self.checkpoint].y);
						let gapX = TO.CoX - FROM.CoX;
						let gapY = TO.CoY - FROM.CoY;
						let nowX = FROM.CoX + (timestamp - LastTime)/span * gapX;
						let nowY = FROM.CoY + (timestamp - LastTime)/span * gapY;
						//console.log(nowX, nowY);
						if(timestamp > LastTime+span){
							LastTime = timestamp;
							FROM = TO
							self.checkpoint++;
							sprite.PositionActual(TO);
						}else{
							sprite.PositionActual({
								CoX: nowX,
								CoY: nowY
							});
						}


						if(self.health <= 0 || self.checkpoint == path.length){
							return false;
						}
						return true;

					}, function(){
						if(self.health > 0)
							self.escape = true;
						self.DESTROY();
					});
					animate.start();
			}
		}

		getEnemy.fn.init.prototype = getEnemy.prototype;
		return getEnemy;
	})();
})(window, game, util, resource, enemy);








