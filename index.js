//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
//var usonic = require('r-pi-usonic');
wpi.setup('wpi');


//pins
var ledpin = 7;
var trigpin = 11;
var echopin = 12;
var dhtpin = 0; //temp

//voltage init
var LOW = 0;
var HIGH = 1;

//set mode
wpi.pinMode(ledpin, wpi.OUTPUT);
wpi.pinMode(trigpin, wpi.OUTPUT);
wpi.pinMode(echopin, wpi.INPUT);

function readUsonicSensor() {
	wpi.digitalWrite(trigpin, 0);
	wpi.delay(50);
	wpi.digitalWrite(trigpin, 1);
	wpi.delay(100);
	wpi.digitalWrite(trigpin, 0);
	
	var pulse_start = wpi.pulseIn(echopin, 0);
	var pulse_end = wpi.pulseIn(echopin, 1);
	var pulse_duration = pulse_end - pulse_start;
	var distance = pulse_duration * 17150;
	return distance;
}

var value = 0;
setInterval(function() {
	wpi.digitalWrite(ledpin, value);
	value = +!value;


	var usonicDistance = readUsonicSensor();
	console.log(usonicDistance);

	sensordht.read();
}, 500);

function readPin(inputPin) {
	var state = wpi.digitalRead(inputPin);
	var stringBuilder = {"messageId":1, "pin": inputPin, "state":state};
	var json = JSON.stringify(stringBuilder);
	console.log(json);
}

function initUsonicSensor() {
	var sensor = usonic.createSensor(echopin, trigpin, 450);
	
	setTimeout(function() { console.log(sensor().toFixed(2)) }, 60);
};
	
var sensordht = {
	sensors: [{
		name: "dht",
		type: 11,
		pin: 8
	}],
	read: function() {
		for (var a in this.sensors) {
			var b = sensorLib.read(this.sensors[a].type, this.sensors[a].pin);
			console.log(this.sensors[a].name + ": " +
			b.temperature.toFixed(1) + "C, " +
			b.humidity.toFixed(1) + "%");
		}
		setTimeout(function() {
			sensor.read();
		}, 2000);
	}
}