"use strict";
//run setups
var wpi = require('wiring-pi');
var dht = require('node-dht-sensor');
wpi.setup('wpi');

//pins
var gas = 9;
var r = 23;
var g = 24;
var b = 26;

var spiclk = 14;
var spimiso = 12;
var spimosi = 13;
var spics = 10;

var motor_one = 22;
var motor_two = 23;
var motor_three = 24;
var motor_four = 25;

//set mode

wpi.pinMode(gas, wpi.INPUT);

wpi.pinMode(motor_one, wpi.OUTPUT);
wpi.pinMode(motor_two, wpi.OUTPUT);
wpi.pinMode(motor_three, wpi.OUTPUT);
wpi.pinMode(motor_four, wpi.OUTPUT);

wpi.pinMode(spimosi, wpi.OUTPUT);
wpi.pinMode(spimiso, wpi.INPUT);
wpi.pinMode(spiclk, wpi.OUTPUT);
wpi.pinMode(spics, wpi.OUTPUT);

wpi.pinMode(r, wpi.PWM_OUTPUT);
wpi.pinMode(g, wpi.PWM_OUTPUT);
wpi.pinMode(b, wpi.PWM_OUTPUT);

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

	read() {
		this.sensor.read(this.type, this.pin, function(err, temperature, humidity) {
			if (!err) {
				this.temp = temperature.toFixed(1);
				this.humidity = humidity.toFixed(1);
			} else {
				return err;
			}
		})
	}
}

var newPin = new Pin(7);
var touch = new Touch(3);
var motion = new Motion(4);
var uson = new Ultrasonic(29, 28);
var dht = new DHT(2, sensor, 11)


var value = 0;
setInterval(function() {
	newPin.setState(value);
	value = +!value;
	
	console.log("----STARTED READING----");
	console.log(`TOUCH: ${touch.getState()}`);
	console.log(`MOTION: ${motion.getState()}`);
	console.log(`USONIC: ${uson.getDistance()}`);
	console.log(`TEMP: ${dht.readTemp()}`);
	console.log(`HUMIDITY: ${dht.readHumidity()}`);
	console.log("----FINISHED READING----");
}, 1000);

var sensordht = {
	sensors: [{
		name: "dht",
		type: 11,
		pin: 2
	}],
	read: function() {
		for (var a in this.sensors) {
			var b = sensordht.read(this.sensors[a].type, this.sensors[a].pin);
			console.log(this.sensors[a].name + ": " +
			b.temperature.toFixed(1) + "C, " +
			b.humidity.toFixed(1) + "%");
		}
		setTimeout(function() {
			sensordht.read();
		}, 2000);
	}
}