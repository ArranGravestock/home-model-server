"use strict";
const fetch = require('node-fetch');

//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
wpi.setup('wpi');


//voltage initiation
var LOW = 0;
var HIGH = 1;

var DEVICE_ID = "1";
var SENSOR_ID = 0;

var JSON_PACKET = {DEVICE_ID: []}
var SENSORS_PACKET = {SENSORS:[]};
var LIGHTS_PACKET = {LIGHTS:[]}




function compilePacket(packet) {
	packet.DEVICE_ID.push(SENSORS_PACKET);
	packet.DEVICE_ID.push(LIGHTS_PACKET);
	var jsonPacket = JSON.stringify(JSON_PACKET)

	//reset packet
	JSON_PACKET.DEVICE_ID = [];
	SENSORS_PACKET.SENSORS = [];
	LIGHTS_PACKET.LIGHTS = [];
    return jsonPacket;
}

//console.log(compilePacket(JSON_PACKET));

class LED {
	constructor(pin) {
		this.pin = pin;
		this.id = SENSOR_ID;
		this.state = 0;
		wpi.pinMode(pin, wpi.OUTPUT);

		SENSOR_ID++;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, this.state);
		LIGHTS_PACKET.LIGHTS.push({"id": this.id, "state": this.state})
	}

	getID() {
		return this.id;
	}
}

class RGBPin {
	constructor(pin) {
		this.pin = pin;
		this.rgb = [255,255,255];
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.OUTPUT);

		SENSOR_ID++;
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

	getID() {
		return this.id;
	}
}

class Touch {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.INPUT);

		SENSOR_ID++;

		setInterval(() => {
			var touch_state = wpi.digitalRead(this.pin);
			this.state = touch_state;
		}, 2000)
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

class Motion {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.INPUT);

		SENSOR_ID++;
		
//		SENSORS_PACKET.SENSORS.push({"id": this.id, "motion": this.state})
	
		setInterval(() => {
			var motion_state = wpi.digitalRead(this.pin);
			this.state = motion_state;
			SENSORS_PACKET.SENSORS.push({"id": this.id, "motion": this.state})
		}, 2000)
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

class Ultrasonic {
	constructor(trigpin, echopin) {
		this.trigpin = trigpin;
		this.echopin = echopin;
		this.distance = 0;
		this.id = SENSOR_ID;

		SENSOR_ID++;

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

	getID() {
		return this.id;
	}
}

class DHT {
	constructor(pin, sensor, type) {
		this.pin = pin;
		this.type = type;
		this.sensor = sensor;
		this.temp = 0;
		this.humidity = 0;
		this.id = SENSOR_ID;

		SENSOR_ID++;
	}

	readTemp() {
		return this.temp;
	}

	readHumidity() {
		return this.humidity;
	}

	getID() {
		return this.id;
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

//initiate pins associated with device
var newPin = new LED(7);
var touch = new Touch(3);
var motion = new Motion(4);
var uson = new Ultrasonic(29, 28);
var dht = new DHT(2, dhtsensor, 11);

function sendPacket(jsonpacket) {
	var PACKET = compilePacket(jsonpacket);
	console.log(PACKET);

	fetch(`http://192.168.1.88:3000/device/${DEVICE_ID}/sensor/${motion.getID()}/${motion.getState()}`, {method: 'PUT'}).then(
		() => console.log("SUCCESS")
	).catch(
		() => console.log("FAILURE")
	)
}

//for testing led
var value = 0;

setInterval(function() {
	newPin.setState(value);
	value = +!value;
	
	console.log("----STARTED READING----");
	console.log(`TOUCH: ${touch.getState()}`);
	console.log(`MOTION: ${motion.getState()}`);
	console.log(`USONIC: ${uson.getDistance()}`);
	dht.read();
	//test();
	sendPacket(JSON_PACKET);
//	console.log(compilePacket(JSON_PACKET));
	//console.log(`TEMP: ${dht.readTemp()}`);
	//console.log(`HUMIDITY: ${dht.readHumidity()}`);
	console.log("----FINISHED READING----\n");
}, 1000);
