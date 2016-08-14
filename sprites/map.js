var game = window.game || {};
var util = window.util || {};

(function(window, game, util, undefined){
	let PT = util.point;
	game.map = {
		choice: 'level2',
		level1: {
			map:[[1,0,0,0,0,0,0,0,0,0],
				[1,1,0,0,0,0,0,0,0,0],
				[0,1,1,0,0,0,0,0,0,0],
				[0,0,1,1,0,0,0,0,0,0],
				[0,0,0,1,1,0,0,0,0,0],
				[0,0,0,0,1,1,0,0,0,0],
				[0,0,0,0,0,1,1,0,0,0],
				[0,0,0,0,0,0,1,1,0,0],
				[0,0,0,0,0,0,0,1,1,0],
				[0,0,0,0,0,0,0,0,1,1]],
			path: [PT(0,-1), PT(0,0), 
				   PT(1,0), PT(1,1),
				            PT(2,1), PT(2,2),
				                     PT(3,2), PT(3,3),
				                              PT(4,3), PT(4,4),
				                                       PT(5,4), PT(5,5),
				                                                PT(6,5), PT(6,6),
				                                                         PT(7,6), PT(7,7),
				                                                                  PT(8,7), PT(8,8),
				                                                                           PT(9,8), PT(9,9), PT(9,10)]
		},
		level2: {
			map:[[1,1,1,1,1,1,1,1,1,1],
				[1,1,0,0,0,0,0,0,0,1],
				[1,0,1,0,0,0,0,0,0,1],
				[1,0,0,1,0,0,0,0,0,1],
				[1,0,0,0,1,0,0,0,0,1],
				[1,0,0,0,0,1,0,0,0,1],
				[1,0,0,0,0,0,1,0,0,1],
				[1,0,0,0,0,0,0,1,0,1],
				[1,0,0,0,0,0,0,0,1,1],
				[1,1,1,1,1,1,1,1,1,1]],
			path:[PT(0,-1),PT(0,0),PT(0,1),PT(0,2),PT(0,3),PT(0,4),PT(0,5),PT(0,6),PT(0,7),PT(0,8),PT(0,9),
				PT(1,9),PT(2,9),PT(3,9),PT(4,9),PT(5,9), PT(6,9), PT(7,9), PT(8,9),
				PT(8,8),PT(7,7),PT(6,6),PT(5,5),PT(4,4),PT(3,3), PT(2,2),PT(1,1),PT(1, 0),
				PT(2,0), PT(3,0),PT(4,0),PT(5,0),PT(6,0),PT(7,0),PT(8,0), PT(9,0),
				PT(9,1), PT(9,2),PT(9,3),PT(9,4),PT(9,5),PT(9,6),PT(9,7),PT(9,8), PT(9,9), PT(9,10)]
		}
	}
	game.map.tile = function(i, j){
		var tile = new game.tile(i, j, game.map[game.map.choice].map[i][j]);
		return tile;
	}
	game.map.travelAround = function(sprite){
		var checkpoint = 0,
		    path = game.map[game.map.choice].path,
		    FROM = sprite.PositionToCoordinate(),
		    LastTime = 0,
		    span = game.settings.OneTileToAnotherTimeSpan,
			animate = new util.animationEngine(function(timestamp){
				let TO = game.sprite.prototype.PositionToCoordinate.call(null, path[checkpoint].x, path[checkpoint].y);
				let gapX = TO.CoX - FROM.CoX;
				let gapY = TO.CoY - FROM.CoY;
				let nowX = FROM.CoX + (timestamp - LastTime)/span * gapX;
				let nowY = FROM.CoY + (timestamp - LastTime)/span * gapY;
				//console.log(nowX, nowY);
				if(timestamp > LastTime+span){
					LastTime = timestamp;
					FROM = TO
					checkpoint++;
					sprite.PositionActual(TO);
				}else{
					sprite.PositionActual({
						CoX: nowX,
						CoY: nowY
					});
				}

				if(checkpoint == path.length){
					return false;
				}
				return true;

			}, function(){
				sprite.DESTROY();
			});
			animate.start();
	}

})(window, game, util);