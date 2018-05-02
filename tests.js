"use strict";
const fetch = require('node-fetch');

//run setups
var wpi = require('wiring-pi');
wpi.setup('wpi');

//import classes
var Touch = require("./components/touch");
var LED = require("./components/led");
var DHT = require("./components/dht");
var dhtsensor = require("node-dht-sensor");
var Motion = require("./components/motion");
var Sound = require("./components/sound");
var Ultrasonic = require("./components/ultrasonic");
var Vibration = require("./components/vibration");
var Fan = require("./components/fan");

var config = require("./config.json");

//initiate an empty packet
var JSON_PACKET = {"DEVICE_ID": config.DEVICE_ID, THINGS: []}

function compilePacket(packet) {
	var jsonPacket = JSON.stringify(JSON_PACKET)

	//reset packet
	JSON_PACKET.THINGS = [];

    return jsonPacket;
}

function sendPacket(jsonpacket) {
	var PACKET = compilePacket(jsonpacket);
	console.log(PACKET);

	fetch(`${config.FETCH_IP}/reading`, {headers: { 'Content-Type': 'application/json' }, method: 'PUT', body: PACKET})
	.then((res) => {
		if(res.ok) {
			console.log("SUCCESS")
		} else {
			console.log("FAILURE")
		}
	})
	.catch(() => console.log("ERROR"))
}

/*
**
** COMPONENT TESTS
** RUN AGAINST TEST DB DATA NOT LIVE
**
*/

exports.Touch = function(test) {
	var comp = new Touch(3);
	
	test.equal(comp.getState(), 0, "assumed no comp state");
	test.equal(comp.getID(), 3, "id equals pin");

	test.done();
}

exports.Led = function(test) {
	var comp = new LED(7);
	test.equal(comp.getID(), 7, "id equals pin");

	comp.setState(1);
	test.equal(comp.getState(), 1, "assumed no comp state");

	comp.fetchState();
	test.equal(comp.getState(), 0, "state returned from db tests");

	test.done();
}

exports.DHT = function(test) {
	var comp = new DHT(26, dhtsensor, 11);
	test.equal(comp.getID("temp"), 26, "id equals pin");
	test.equal(comp.getID("humidity"), 27, "id equals pin+1");

	test.equal(comp.getTemp(), 0, "dht failed setup [temp]");
	test.equal(comp.getHumidity(), 0, "dht failed setup [humid]");

	comp.setTemp(15);
	comp.setHumidity(10);
	test.equal(comp.getTemp(), 15, "temp is 10");
	test.equal(comp.getHumidity(), 10, "humidity is 15");

	test.done();
}

exports.Fan = function(test) {
	var comp = new Fan(0);


	comp.setState(1);
	test.equal(comp.getState(), 1, "assumed no comp state");

	comp.fetchState();
	test.equal(comp.getState(), 0, "state returned from db tests");

	test.done();
}

exports.Motion = function(test) {
	var comp = new Motion(4);
	test.equal(comp.getID(), 4, "id equals pin");

	test.done();
}

exports.Sound = function(test) {
	var comp = new Sound(4);
	test.equal(comp.getID(), 4, "id equals pin");

	test.done();
}

exports.Ultrasonic = function(test) {
	var comp = new Ultrasonic(4, 5);
	test.equal(comp.getID(), 4, "id equals pin");

	comp.setDistance(10);
	test.equal(comp.getDistance(), 10, "assumed no comp state");

	test.done();
}

exports.Vibration = function(test) {
	var comp = new Vibration(4);
	test.equal(comp.getID(), 4, "id equals pin");

	test.done();
}
