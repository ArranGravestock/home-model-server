var wpi = require('wiring-pi');

wpi.setup('wpi');

//pins
var pin = 7;

wpi.pinMode(pin, wpi.OUTPUT);

var value = 0;
setInterval(function() {
	wpi.digitalWrite(pin, value);
value = +!value;
readPin(pin);
}, 500);

function readPin(inputPin) {
	var state = wpi.digitalRead(inputPin);
	var stringBuilder = {"messageId":1, "pin": inputPin, "state":state};
	var json = JSON.stringify(stringBuilder);
	console.log(json);
}
	
