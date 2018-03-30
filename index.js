"use strict";
//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
wpi.setup('wpi');

//voltage initiation
var LOW = 0;
var HIGH = 1;

class Pin {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		wpi.pinMode(pin, wpi.OUTPUT);
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, this.state);
	}

	getJson() {
		var arr = {ledid: this.pin, state: this.state};
		return JSON.stringify(arr);
	}
}

class RGBPin {
	constructor(pin) {
		this.pin = pin;
		this.rgb = [255,255,255];
		wpi.pinMode(pin, wpi.OUTPUT);
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, this.state);
	}

	setRGB(rgb) {
		this.rgb = rgb;
	}

	getJson() {
		var arr = {ledid: this.pin, state: this.state, rgb: this.rgb}
		return JSON.stringify(arr);
	}
}

class Touch {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		wpi.pinMode(pin, wpi.INPUT);

		setInterval(() => {
			var touch_state = wpi.digitalRead(this.pin);
			this.state = touch_state;
		}, 2000)
	}

	getState() {
		return this.state;
	}
}

class Motion {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		wpi.pinMode(pin, wpi.INPUT);

		setInterval(() => {
			var motion_state = wpi.digitalRead(this.pin);
			this.state = motion_state;
		}, 2000)
	}

	getState() {
		return this.state;
	}
}

class Ultrasonic {
	constructor(trigpin, echopin) {
		this.trigpin = trigpin;
		this.echopin = echopin;
		this.distance = 0;

		wpi.pinMode(trigpin, wpi.OUTPUT);
		wpi.pinMode(echopin, wpi.INPUT);

		setInterval(() => {
			this.distance = this.readDistance();
		}, 2000)
	}

	readDistance() {
		wpi.digitalWrite(this.trigpin, 0);
		wpi.delayMicroseconds(5);
		wpi.digitalWrite(this.trigpin, 1);
		wpi.delayMicroseconds(10);
		wpi.digitalWrite(this.trigpin, 0);

		var pulse_start = wpi.pulseIn(this.echopin, 1);
		var distance_cm = pulse_start / 2 / 29.1;
		return distance_cm.toFixed(2);
	}

	getDistance() {
		return this.distance;
	}
}

class DHT {
	constructor(pin, sensor, type) {
		this.pin = pin;
		this.type = type;
		this.sensor = sensor;
		this.temp = 0;
		this.humidity = 0;
	}

	readTemp() {
		return this.temp;
	}

	readHumidity() {
		return this.humidity;
	}

	setTemp(temp) {
		this.temp = temp;
	}

	read() {
		this.sensor.read(this.type, this.pin, function(err, temperature, humidity) {
			if (!err) {
				this.temp = temperature.toFixed(1);
				this.humidity = humidity.toFixed(1);
				var result = [this.temp, this.humidity];
				console.log(result);
				//callback(result)
			} else {
				//callback(err);
			}
		})
	}
}

var newPin = new Pin(7);
var touch = new Touch(3);
var motion = new Motion(4);
var uson = new Ultrasonic(29, 28);
var dht = new DHT(2, dhtsensor, 11)
var value = 0;

setInterval(function() {
	newPin.setState(value);
	value = +!value;
	
	console.log("----STARTED READING----");
	console.log(`TOUCH: ${touch.getState()}`);
	console.log(`MOTION: ${motion.getState()}`);
	console.log(`USONIC: ${uson.getDistance()}`);
	dht.read();
	//console.log(`TEMP: ${dht.readTemp()}`);
	//console.log(`HUMIDITY: ${dht.readHumidity()}`);
	console.log("----FINISHED READING----\n");
}, 1000);
