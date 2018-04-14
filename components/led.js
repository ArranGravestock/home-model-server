"use strict";

class LED {
	constructor(pin) {
		this.pin = pin;
		this.id = SENSOR_ID;
		this.state = this.fetchState();
		wpi.pinMode(pin, wpi.OUTPUT);

		SENSOR_ID++;
	}

	getState() {
		return this.state;
	}

	setState(state) {
		this.state = state;
		wpi.digitalWrite(this.pin, state);
	}

	fetchState() {
		fetch(`http://192.168.1.88:3000/device/${DEVICE_ID}/light/${this.id}`, 
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

module.exports.LED = LED;
