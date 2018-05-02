"use strict";

//run setups
var wpi = require('wiring-pi');
wpi.setup('wpi');

//import classes
var Touch = require("./components/touch");

exports.testTouch = function(test) {
	var touch = new Touch(3);
	
	touch.readState();

	test.equal(touch.getState(), 0, "assumed no touch state");
	test.equal(touch.getID(), 3, "id equals pin");

	test.done();
}


