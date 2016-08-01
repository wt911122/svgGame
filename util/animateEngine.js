var util = window.util || {};

(function(window, util){
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame  || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
//console.log(window.cancelAnimationFrame);
var engine = util.animationEngine = function(fn, res){
	this.callbackFn = fn;
	this.continue = true;
	this.response = res;
}
engine.prototype = {
	start: function(){
		this.requestID = window.requestAnimationFrame( this.updateFrame.bind(this) );
	},
	stop: function(){
		//console.log(this.requestID);
		window.cancelAnimationFrame( this.requestID )
	},
	updateFrame: function(timestamp){
		if (!this.startTime)
			this.startTime = timestamp;
		var progress = timestamp - this.startTime;

		if(this.callbackFn(timestamp)){
			window.requestAnimationFrame( this.updateFrame.bind(this) );
		}else{
			this.response();
		}
	}
}

})(window, util)