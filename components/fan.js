"use strict";
var wpi = require('wiring-pi');
const fetch = require('node-fetch');

class Fan {
	constructor(pin) {
		this.pin = pin;
		this.id = pin;
		this.state = this.fetchState();
		wpi.pinMode(pin, wpi.OUTPUT);
		
	}

	getState() {
		return this.state
	}
	
	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, state);
	}

	fetchState() {
		fetch(`${FETCH_IP}/device/${DEVICE_ID}/type/remote/${this.id}`, 
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
				this.setState(1);
			} else {
				this.setState(0);
			}
			//this.setState(this.state);
		})
		.catch(err => {
			console.log(err);
		})
	}
}

module.exports = Fan;