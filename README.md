# Server Home Model
The hub provides a hardware interface for acting between basic rpi components and raspberry pi, which also further adds the capability to send the data through the `home-model-api`, which can be used in a web client.

## Installation
Requires BCM2835 & wiring pi installation on the raspberry pi before hand, follow the instructions at:
[airspayce bcm2835](http://www.airspayce.com/mikem/bcm2835/)
[wiring pi](http://wiringpi.com/download-and-install/)

then:
Install dependencies:
```
npm install
```
To run the server
```
node index.js
````

To run tests
```
nodeunit tests.js
```

## Registering new components
To register a new component, in ```index.js```, create a new variable and instantiate it to the correct component choice, followed by the pin number e.g.
```javascript
var mynewfan = new Fan(9) //connected to wPi pin 9
```
Each component is declared as follows: 
```
var led = new LED(<PIN>);
var fan = new Fan(<PIN>);
var touch = new Touch(<PIN>);
var motion = new Motion(<PIN>);
var vibration = new Vibration(<PIN>);
var sound = new Sound(<PIN>)
var uson = new Ultrasonic(<TRIG PIN>, <ECHO PIN>);

//dht is defined by BCM pin, refer to http://wiringpi.com/pins/
var dht = new DHT(<PIN>, dhtsensor, <DHT TYPE, 11 || 22>); 
```

## Built with
- [Node.js](https://nodejs.org/en/)
- [Wiring-pi-node](https://github.com/WiringPi/WiringPi-Node)

## Dependencies
```
"node-dht-sensor": "0.0.34",
"node-fetch": "^2.1.2",
"wiring-pi": "^2.2.1"
```

## Todo
```
-Initialise components through the database rather than through the server
-Add better support for a wider range of components
```

## Authors
- Arran Gravestock

## License
This project is licensed under the MIT License - see the LICENSE.md file for details
