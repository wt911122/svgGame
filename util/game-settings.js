var game = window.game || {};

(function(window, game){
	game.settings = {};
	Object.defineProperties(game.settings, {
		"width":{
			value: 1240
		},
		"height":{
			value: 640
		},
		"padding":{
			value: 20
		},
		"dx": {
			value: 60
		},
		"dy": {
			value: 30
		},
		"row":{
			value: 10
		},
		"col": {
			value: 10
		}
	})
})(window, game);