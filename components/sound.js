"use strict";
var wpi = require('wiring-pi');

class Sound {
	constructor(pin) {
		this.pin = pin;
		this.state = wpi.digitalRead(pin);
		this.id = pin;
		wpi.pinMode(pin, wpi.INPUT);
	}

	readState() {
		var sound_state = wpi.digitalRead(this.pin);
		this.state = !sound_state;
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

module.exports = Sound;