var game = window.game || {};

(function(window, game, util, undefined){
	
	game.map = {
		choice: 'level1',
		level1: [[1,0,0,0,0,0,0,0,0,0],
				[1,1,0,0,0,0,0,0,0,0],
				[0,1,1,0,0,0,0,0,0,0],
				[0,0,1,1,0,0,0,0,0,0],
				[0,0,0,1,1,0,0,0,0,0],
				[0,0,0,0,1,1,0,0,0,0],
				[0,0,0,0,0,1,1,0,0,0],
				[0,0,0,0,0,0,1,1,0,0],
				[0,0,0,0,0,0,0,1,1,0],
				[0,0,0,0,0,0,0,0,1,1]]
	}
	game.map.tile = function(i, j){
		var tile = new game.tile(i, j, game.map[game.map.choice][i][j]);
		return tile;
	}

})(window, game, util);