'Use Strict';

let deviceModel = require('../models/devices');
let lightModel = require('../models/lights');
let roomModel = require('../models/rooms');
let sensorModel = require('../models/sensors');
let userModel = require('../models/users');

var crypto = require('crypto');

module.exports = {
    newUser: (req, res) => {
        userModel.createUser(req.query).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    validateLogin: (req, res) => {
        userModel.validateLogin(req.query).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    DeviceNames: (req, res) => {
        deviceModel.getDevices().then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    DeviceRooms: (req, res) => {
        deviceModel.getDeviceRooms(req.params).then(
            function() {
                res.status(204);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    RoomLights: (req, res) => {
        roomModel.RoomLights(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    RoomSensors: (req, res) => {
        roomModel.RoomSensors(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    SensorState: (req, res) => {
        sensorModel.SensorState(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
    
    LightState: (req, res) => {
        lightModel.LightState(req.params).then(
            function() {
                res.status(201);
                res.send("success");
            }
        ).catch(
            function() {
                res.status(400);
                res.send("failure");
            }
        )
    },
}