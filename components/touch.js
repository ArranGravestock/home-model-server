class Touch {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = pin;
		wpi.pinMode(pin, wpi.INPUT);
	}

	readState() {
		var touch_state = wpi.digitalRead(this.pin);
		this.state = touch_state;
		JSON_PACKET.THINGS.push({"id": this.id, "state": this.state})
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

module.exports = Touch;