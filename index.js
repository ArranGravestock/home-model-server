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
//var Touch = require("./components/touch");

//set device defaults
var DEVICE_ID = "UBVXug97hdIAwOM";
var FETCH_IP = "http://192.168.1.88:3000"

//initiate an empty packet
var JSON_PACKET = {"DEVICE_ID": DEVICE_ID, THINGS: []}

function compilePacket(packet) {
	var jsonPacket = JSON.stringify(JSON_PACKET)

	//reset packet
	JSON_PACKET.THINGS = [];

    return jsonPacket;
}


function sendPacket(jsonpacket) {
	var PACKET = compilePacket(jsonpacket);
	console.log(PACKET);

	fetch(`${FETCH_IP}/reading`, {headers: { 'Content-Type': 'application/json' }, method: 'PUT', body: PACKET})
	.then((res) => {
		if(res.ok) {
			console.log("SUCCESS")
		} else {
			console.log("FAILURE")
		}
	})
	.catch(() => console.log("ERROR"))
}

//create components
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

class LED {
	constructor(pin) {
		this.pin = pin;
		this.id = pin;
		this.state = this.fetchState();
		wpi.pinMode(pin, wpi.OUTPUT);
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
		this.id = pin;
		this.state = this.fetchState();
		wpi.pinMode(pin, wpi.OUTPUT);
		
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

class Ultrasonic {
	constructor(trigpin, echopin) {
		this.trigpin = trigpin;
		this.echopin = echopin;
		this.distance = this.readDistance();
		this.id = trigpin;

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

		this.temp_id = pin;
		this.humidity_id = pin + 1;
	}

	getTemp() {
		return this.temp;
	}

	getHumidity() {
		return this.humidity;
	}

	getID(type) {
		if (type === "temp") {
			return this.temp_id;
		} else if (type === "humidity") {
			return this.humidity_id;
		}
	}

	setTemp(temp) {
		this.temp = temp;
	}

	setHumidity(humid) {
		this.humidity = humid;
	}

	read() {
		this.sensor.read(this.type, this.pin, (err, temperature, humidity) => {
			if (!err) {
				this.setTemp(temperature.toFixed(1));
				this.setHumidity(humidity.toFixed(1));
			} else {
				//handle the error somehow
			}
		})
	}
}


//initiate devices
//read components
var led = new LED(7);
var fan = new Fan(0);
var fanz = new Fan(2);

//write components
var touch = new Touch(3);
var motion = new Motion(4);
var uson = new Ultrasonic(29, 28);
var dht = new DHT(26, dhtsensor, 11); //dht uses bcm not wPi pin
var vibration = new Vibration(5);
var sound = new Sound(26)

setInterval(function() {
	
	console.log("----STARTED READING----");
	console.log("-----------------------");

	led.fetchState();
	fan.fetchState();
	fanz.fetchState();

	touch.readState();
	motion.readState();
	uson.readDistance();
	dht.read();
	led.fetchState();
	fan.fetchState();
	fanz.fetchState();
	vibration.readState();
	sound.readState();

	JSON_PACKET.THINGS.push({"id": touch.getID(), "state": touch.getState()})
	JSON_PACKET.THINGS.push({"id": motion.getID(), "state": motion.getState()})
	JSON_PACKET.THINGS.push({"id": vibration.getID(), "state": vibration.getState()})
	JSON_PACKET.THINGS.push({"id": sound.getID(), "state": sound.getState()})
	JSON_PACKET.THINGS.push({"id": uson.getID(), "state": uson.getDistance()})
	JSON_PACKET.THINGS.push({"id": dht.getID("humid"), "state": dht.getHumidity()})
	JSON_PACKET.THINGS.push({"id": dht.getID("humidity"), "state": dht.getTemp()})

	console.log(`TOUCH: ${touch.getState()}`);
	console.log(`MOTION: ${motion.getState()}`);
	console.log(`USONIC: ${uson.getDistance()}`);
	console.log(`TEMP: ${dht.getTemp()}`);
	console.log(`HUMIDITY: ${dht.getHumidity()}`);
	console.log(`FAN-1: ${fan.getState()}`);
	console.log(`FAN-2: ${fanz.getState()}`);
	console.log(`VIBRATION: ${vibration.getState()}`)
	console.log(`SOUND: ${sound.getState()}`)

	console.log("-----------------------");
	console.log("----FINISHED READING----\n");

	sendPacket(JSON_PACKET);
}, 2000);
