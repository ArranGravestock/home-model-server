"use strict";
var dhtsensor = require('node-dht-sensor');
var wpi = require('wiring-pi');
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

module.exports = DHT;