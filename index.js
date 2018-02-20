var wpi = require('wiring-pi');

wpi.setup('wpi');

//pins
var pin = 5;


wpi.pinMode(pin, wpi.OUTPUT);

setInterval(readPin(pin), 1000);

function readPin(pin) {
    var state = wpi.digitalRead(this.pin);

    var stringBuilder = {"messageId": 1, "pin": this.pin, "state":state}

    var json = JSON.stringify(jsonBuilder);
    console.log(json);
    //return json;
}