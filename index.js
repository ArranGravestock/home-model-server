"use strict";
const fetch = require('node-fetch');

//run setups
var wpi = require('wiring-pi');
wpi.setup('wpi');

//import classes
var Touch = require("./components/touch");
var LED = require("./components/led");
var DHT = require("./components/dht");
var Motion = require("./components/motion");
var Sound = require("./components/sound");
var Ultrasonic = require("./components/ultrasonic");
var Vibration = require("./components/vibration");
var Fan = require("./components/fan");

var config = require("./config.json");

//set device defaults
var DEVICE_ID = config.DEVICE_ID;
var FETCH_IP = config.FETCH_IP;

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
var sound = new Sound(22)

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
	JSON_PACKET.THINGS.push({"id": dht.getID("humidity"), "state": dht.getHumidity()})
	JSON_PACKET.THINGS.push({"id": dht.getID("temp"), "state": dht.getTemp()})

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
