var createSVGjs = require('./Event.js');
var extendfunc = require('./extend.js')

var test = function(){
	console.log(this);
}
extendfunc(test, createSVGjs.EventDispatcher)

var obj = new test();