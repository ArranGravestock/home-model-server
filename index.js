//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
wpi.setup('wpi');


//pins
var ledpin = 7;
var trigpin = 29;
var echopin = 28;
var motion = 4;
var touch = 3;

//voltage init
var LOW = 0;
//var HIGH = 1;

//set mode
wpi.pinMode(ledpin, wpi.OUTPUT);
wpi.pinMode(trigpin, wpi.OUTPUT);
wpi.pinMode(echopin, wpi.INPUT);
wpi.pinMode(motion, wpi.INPUT);
wpi.pinMode(touch, wpi.INPUT);

function readTouch() {
	var touch_state = wpi.digitalRead(touch);
	if (touch_state) {
		console.log("touch activated");
	} else {
		console.log("no touch");
	}
}

function readMotion() {
	var motion_state = wpi.digitalRead(motion);
	
	if (motion_state) {	
		console.log("motion detected");
	} else {
		console.log("no motion");
	}
	wpi.delay(500);
}

function readUsonicSensor() {
	//var pulse_start = wpi.micros();
//	var pulse_start = wpi.pulseIn(echopin, 1);
	wpi.digitalWrite(trigpin, 0);
	wpi.delayMicroseconds(5);
	wpi.digitalWrite(trigpin, 1);
	wpi.delayMicroseconds(10);
	wpi.digitalWrite(trigpin, 0);
	
	var pulse_start = wpi.pulseIn(echopin, 1);
	//var pulse_end = wpi.pulseIn(echopin, 1);
	//var pulse_duration = pulse_end - pulse_start;
	//var distance = pulse_duration * 17150;
//	console.log(pulse_start);
	var distance_cm = pulse_start / 2 / 29.1;
	console.log(distance_cm.toFixed(2)+ "cm");
}

var value = 0;
setInterval(function() {
	wpi.digitalWrite(ledpin, value);
	value = +!value;

	readUsonicSensor();	
	readTouch();
	test();
	readMotion();	
}, 300);

function readPin(inputPin) {
	var state = wpi.digitalRead(inputPin);
	var stringBuilder = {"messageId":1, "pin": inputPin, "state":state};
	var json = JSON.stringify(stringBuilder);
	console.log(json);
}
	
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

var sensor = require('node-dht-sensor');

function test() {
sensor.read(11, 2, function(err, temperature, humidity) {
    if (!err) {
        console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
            'humidity: ' + humidity.toFixed(1) + '%');
	} else {
		console.log(err);
	}
    });
}
