//run setups
var wpi = require('wiring-pi');
var dhtsensor = require('node-dht-sensor');
var usonic = require('r-pi-usonic');
wpi.setup('wpi');


//pins
var ledpin = 7;
var trigpin = 11;
var echopin = 32;
var motion = 16	;
var touch = 15;

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
	if (wpi.digitalRead(touch)) {
		console.log("touch activated");
	} else {
		console.log(wpi.digitalRead(touch));
	}
}

function readMotion() {
	if (wpi.digitalRead(motion)) {
		console.log(wpi.digitalRead(motion));	
		console.log("motion detected");
	} else {
		console.log("no motion");
	}
	wpi.delay(5000);
}

usonic.init(function (error) {
	if (error) {
		console.log(error);
	} else {
		var sensor = usonic.createSensor(echopin, trigpin, 450);
		setInterval(function() {
			var distance = sensor();
//			console.log(distance);
		}, 500);
	}
});

function readUsonicSensor() {
	var pulse_start = 0;

	wpi.digitalWrite(trigpin, 1);
	wpi.delayMicroseconds(10);
	wpi.digitalWrite(trigpin, 0);
	
	pulse_start = wpi.pulseIn(echopin, 1);
	//var pulse_end = wpi.pulseIn(echopin, 1);
	//var pulse_duration = pulse_end - pulse_start;
	//var distance = pulse_duration * 17150;
	console.log(pulse_start);
}

var value = 0;
setInterval(function() {
	wpi.digitalWrite(ledpin, value);
	value = +!value;
	readUsonicSensor();	
//	readTouch();
//	readMotion();	
}, 100);

function readPin(inputPin) {
	var state = wpi.digitalRead(inputPin);
	var stringBuilder = {"messageId":1, "pin": inputPin, "state":state};
	var json = JSON.stringify(stringBuilder);
	console.log(json);
}

function initUsonicSensor() {
	var sensor = usonic.createSensor(echopin, trigpin, 450);
	
//	setTimeout(function() { console.log(sensor().toFixed(2)) }, 60);
};
	
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
