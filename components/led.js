"use strict";
var wpi = require('wiring-pi');
const fetch = require('node-fetch');
var config = require("../config.json");
var FETCH_IP = config.FETCH_IP;
var DEVICE_ID = config.DEVICE_ID;

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

module.exports = LED;
