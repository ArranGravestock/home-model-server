"use strict";
var wpi = require('wiring-pi');

class Motion {
	constructor(pin) {
		this.pin = pin;
		this.state = wpi.digitalRead(pin);
		this.id = pin;
		wpi.pinMode(pin, wpi.INPUT);
	}

	readState() {
		var motion_state = wpi.digitalRead(this.pin);
		this.state = motion_state;
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

module.exports = Motion;