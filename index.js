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

var spiclk = 14;
var spimiso = 12;
var spimosi = 13;
var spics = 10;

var motor_one = 22;
var motor_two = 23;
var motor_three = 24;
var motor_four = 25;

//voltage init
var LOW = 0;
//var HIGH = 1;

//set mode
wpi.pinMode(ledpin, wpi.OUTPUT);
wpi.pinMode(trigpin, wpi.OUTPUT);
wpi.pinMode(echopin, wpi.INPUT);
wpi.pinMode(motion, wpi.INPUT);
wpi.pinMode(touch, wpi.INPUT);

wpi.pinMode(motor_one, wpi.OUTPUT);
wpi.pinMode(motor_two, wpi.OUTPUT);
wpi.pinMode(motor_three, wpi.OUTPUT);
wpi.pinMode(motor_four, wpi.OUTPUT);

wpi.pinMode(spimosi, wpi.OUTPUT);
wpi.pinMode(spimiso, wpi.INPUT);
wpi.pinMode(spiclk, wpi.OUTPUT);
wpi.pinMode(spics, wpi.OUTPUT);

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
	wpi.digitalWrite(trigpin, 0);
	wpi.delayMicroseconds(5);
	wpi.digitalWrite(trigpin, 1);
	wpi.delayMicroseconds(10);
	wpi.digitalWrite(trigpin, 0);
	
	var pulse_start = wpi.pulseIn(echopin, 1);
	var distance_cm = pulse_start / 2 / 29.1;
	console.log(distance_cm.toFixed(2)+ "cm");
}

var value = 0;
setInterval(function() {
	wpi.digitalWrite(ledpin, value);
	value = +!value;

//	readUsonicSensor();	
//	readTouch();
//	test();
//	readMotion();	
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

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	startMotor(d);
});

function setStep(w1, w2, w3, w4) {
	wpi.digitalWrite(motor_one, w1);
	wpi.digitalWrite(motor_two, w2);
	wpi.digitalWrite(motor_three, w3);
	wpi.digitalWrite(motor_four, w4);
}

function startMotor(data) {
	if (data == 0) {
		for (var i = 0; i > 100; i++) {
//		console.log(data + " :data");

		setStep(1,0,0,1);		
		wpi.delayMicroseconds(1);
		setStep(0,1,0,1);
		wpi.delayMicroseconds(1);
		setStep(0,1,1,0);
		wpi.delayMicroseconds(1);
		setStep(1,0,1,0);
		wpi.delayMicroseconds(1);}
	} else {
		setStep(1,0,1,0);
		wpi.delayMicroseconds(1);
		setStep(0,1,1,0);
		wpi.delayMicroseconds(1);
		setStep(0,1,0,1);
		wpi.delayMicroseconds(1);
		setStep(1,0,0,1);
		wpi.delayMicroseconds(1);
	}
}
