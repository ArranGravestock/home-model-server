"use strict";
var wpi = require('wiring-pi');
class Ultrasonic {
	constructor(trigpin, echopin) {
		this.trigpin = trigpin;
		this.echopin = echopin;
		this.distance = this.readDistance();
		this.id = trigpin;

		wpi.pinMode(trigpin, wpi.OUTPUT);
		wpi.pinMode(echopin, wpi.INPUT);
	}

	setDistance(distance) {
		this.distance = distance
	}

	readDistance() {
		wpi.digitalWrite(this.trigpin, 0);
		wpi.delayMicroseconds(5);
		wpi.digitalWrite(this.trigpin, 1);
		wpi.delayMicroseconds(10);
		wpi.digitalWrite(this.trigpin, 0);

		var pulse_start = wpi.pulseIn(this.echopin, 1);
		var distance_cm = pulse_start / 2 / 29.1;
		this.setDistance(distance_cm.toFixed(2));
	}

	getDistance() {
		return this.distance;
	}

	getID() {
		return this.id;
	}
}

module.exports = Ultrasonic;