var wpi = require('wiring-pi');
class Touch {
	constructor(pin) {
		this.pin = pin;
		this.state = wpi.digitalRead(pin);
		this.id = pin;
		wpi.pinMode(pin, wpi.INPUT);
	}

	readState() {
		var touch_state = wpi.digitalRead(this.pin);
		this.state = touch_state;
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

module.exports = Touch;