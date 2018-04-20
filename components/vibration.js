"use strict";
var wpi = require('wiring-pi');

class Vibration {
	constructor(pin) {
		this.pin = pin;
		this.state = wpi.digitalRead(pin);
		this.id = pin;
		wpi.pinMode(pin, wpi.INPUT);
	}

	readState() {
		var vibration_state = wpi.digitalRead(this.pin);
		this.state = vibration_state;
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

module.exports = Vibration;