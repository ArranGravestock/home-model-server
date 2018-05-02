# Server Home Model
description

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
