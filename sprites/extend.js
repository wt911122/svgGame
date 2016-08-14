this.createSVGjs = this.createSVGjs || {};
createSVGjs.extend = function(subclass, superclass) {
	"use strict";

	function o() { this.constructor = subclass; }
	o.prototype = superclass.prototype;
	return (subclass.prototype = new o());
};
//module.exports = extendfunc;