"use strict";
const fetch = require('node-fetch');

//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
wpi.setup('wpi');

//voltage initiation
var LOW = 0;
var HIGH = 1;

//import classes
var Touch = require("./components/touch");

//set device defaults
var DEVICE_ID = "1";
var FETCH_IP = "http://192.168.1.88:3000"
var SENSOR_ID = 1;

//initiate an empty packet
var JSON_PACKET = {"DEVICE_ID": DEVICE_ID, THINGS: []}

function compilePacket(packet) {
	var jsonPacket = JSON.stringify(JSON_PACKET)

	//reset packet
	JSON_PACKET.THINGS = [];

    return jsonPacket;
}

class LED {
	constructor(pin) {
		this.pin = pin;
		this.id = SENSOR_ID;
		this.state = this.fetchState();
		wpi.pinMode(pin, wpi.OUTPUT);

		SENSOR_ID++;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, state);
	}

	fetchState() {
		fetch(`${FETCH_IP}/device/${DEVICE_ID}/type/light/${this.id}`, 
			{
				method: 'GET', 
				credentials: 'include',
				headers: {
					'content-type':'application/json',
					'access-control-allow-origin':'*'
				}
			}
		)
		.then(res => res.json())
		.then(json => {
			var state = json[0].ThingState;
			//not sure why this is caused...
			if (state) {
				this.setState(0)
			} else {
				this.setState(1)
			}
		})
		.catch(err => {
			console.log(err);
		})
	}

	getID() {
		return this.id;
	}
}

class Fan {
	constructor(pin) {
		this.pin = pin;
		this.id = SENSOR_ID;
		this.state = 0;
		wpi.pinMode(pin, wpi.OUTPUT);
		
		SENSOR_ID++;
	}

	getState() {
		return this.state
	}
	
	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, state);
	}

	fetchState() {
		fetch(`${FETCH_IP}/device/${DEVICE_ID}/type/remote/${this.id}`, 
			{
				method: 'GET', 
				credentials: 'include',
				headers: {
					'content-type':'application/json',
					'access-control-allow-origin':'*'
				}
			}
		)
		.then(res => res.json())
		.then(json => {
			var state = json[0].ThingState;
			//not sure why this is caused...
			if (state) {
				this.setState(1);
			} else {
				this.setState(0);
			}
			//this.setState(this.state);
		})
		.catch(err => {
			console.log(err);
		})
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
		// JSON_PACKET.THINGS.push({"id": this.id, "state": this.state, "rgb": this.rgb})
	}

	setRGB(rgb) {
		this.rgb = rgb;
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
	}

	readState() {
		var motion_state = wpi.digitalRead(this.pin);
		this.state = motion_state;
		JSON_PACKET.THINGS.push({"id": this.id, "state": this.state})
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

class Water {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.INPUT);

		SENSOR_ID++;
	}

	readState() {
		var water_state = wpi.digitalRead(this.pin);
		this.state = water_state;
		JSON_PACKET.THINGS.push({"id": this.id, "state": this.state})
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

class Vibration {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.INPUT);

		SENSOR_ID++;
	}

	readState() {
		var vibration_state = wpi.digitalRead(this.pin);
		this.state = vibration_state;
		JSON_PACKET.THINGS.push({"id": this.id, "state": this.state})
	}

	getState() {
		return this.state;
	}

	getID() {
		return this.id;
	}
}

class Sound {
	constructor(pin) {
		this.pin = pin;
		this.state = 0;
		this.id = SENSOR_ID;
		wpi.pinMode(pin, wpi.INPUT);

		SENSOR_ID++;
	}

	readState() {
		var sound_state = wpi.digitalRead(this.pin);
		this.state = !sound_state;
		JSON_PACKET.THINGS.push({"id": this.id, "state": this.state})
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
	}

	readDistance() {
		wpi.digitalWrite(this.trigpin, 0);
		wpi.delayMicroseconds(5);
		wpi.digitalWrite(this.trigpin, 1);
		wpi.delayMicroseconds(10);
		wpi.digitalWrite(this.trigpin, 0);

		var pulse_start = wpi.pulseIn(this.echopin, 1);
		var distance_cm = pulse_start / 2 / 29.1;
		this.distance = distance_cm.toFixed(2);

		JSON_PACKET.THINGS.push({"id": this.id, "state": this.distance})
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
		// this.id = SENSOR_ID;

		this.temp_id = SENSOR_ID;
		this.humidity_id = SENSOR_ID + 1;

		SENSOR_ID = SENSOR_ID+2;
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
		this.sensor.read(this.type, this.pin, (err, temperature, humidity) => {
			if (!err) {
				this.temp = temperature.toFixed(1);
				this.humidity = humidity.toFixed(1);
				JSON_PACKET.THINGS.push({"id": this.temp_id, "state": this.temp})
				JSON_PACKET.THINGS.push({"id": this.humidity_id, "state": this.humidity})
			} else {
				//handle the error somehow
			}
		})
	}
}

function sendPacket(jsonpacket) {
	var PACKET = compilePacket(jsonpacket);
	console.log(PACKET);
	//${FETCH_IP}/device/${DEVICE_ID}/sensor/${motion.getID()}/${motion.getState()}

	fetch(`${FETCH_IP}/reading`, {headers: { 'Content-Type': 'application/json' }, method: 'PUT', body: PACKET}).then(
		() => console.log("SUCCESS")
	).catch(
		() => console.log("FAILURE")
	)
}


//initiate pins associated with device
var newPin = new LED(7);
var touch = new Touch(3);
var motion = new Motion(4);
var uson = new Ultrasonic(29, 28);
//dht uses bcm pin not wpi
var dht = new DHT(26, dhtsensor, 11);
var fan = new Fan(0);
var fanz = new Fan(2);
var water = new Water(6);
var vibration = new Vibration(5);
var sound = new Sound(26)

setInterval(function() {
	
	console.log("----STARTED READING----");
	console.log("-----------------------");
	
	touch.readState();
	motion.readState();
	uson.readDistance();
	dht.read();
	newPin.fetchState();
	fan.fetchState();
	fanz.fetchState();	
	water.readState();
	vibration.readState();
	sound.readState();

	console.log(`TOUCH: ${touch.getState()}`);
	console.log(`MOTION: ${motion.getState()}`);
	console.log(`USONIC: ${uson.getDistance()}`);
	console.log(`TEMP: ${dht.readTemp()}`);
	console.log(`HUMIDITY: ${dht.readHumidity()}`);
	console.log(`WATER: ${water.getState()}`);
	console.log(`FAN-1: ${fan.getState()}`);
	console.log(`FAN-2: ${fanz.getState()}`);
	console.log(`VIBRATION: ${vibration.getState()}`)
	console.log(`VIBRATION: ${sound.getState()}`)

	console.log("-----------------------");
	console.log("----FINISHED READING----\n");

	// console.log("----COMPILING PACKET----");
	// console.log("------------------------");
	sendPacket(JSON_PACKET);
	// console.log("---FINISHED COMPILING---\n");
}, 2000);
