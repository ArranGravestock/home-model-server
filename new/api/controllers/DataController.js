'Use Strict';

let deviceModel = require('../models/devices');
let lightModel = require('../models/lights');
let roomModel = require('../models/rooms');
let sensorModel = require('../models/sensors');
let userModel = require('../models/users');

var crypto = require('crypto');

module.exports = {
    newUser: (req, res) => {
        console.log("new user(s) initiated...");   
        userModel.createUser(req.query, function(result) {
            if (result) {
                res.status(202);
                res.send("success");
            } else {
                res.status(404);
                res.send("failed");
            }
        })
    },
    
    validateLogin: (req, res) => {
        //console.log(userModel.checkUser(req.query));
        userModel.validateLogin(req.query, function(result) {
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    DeviceNames: (req, res) => {
        deviceModel.getDevices(function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    DeviceRooms: (req, res) => {
        deviceModel.getDeviceRooms(req.params, function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    RoomLights: (req, res) => {
        roomModel.RoomLights(req.params, function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    RoomSensors: (req, res) => {
        roomModel.RoomSensors(req.params, function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    SensorState: (req, res) => {
        sensorModel.SensorState(req.params, function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    },
    
    LightState: (req, res) => {
        lightModel.LightState(req.params, function(result) {
            console.log(result);
            if (result) {
                res.status(201);
                res.send("success");
            } else {
                res.status(400);
                res.send("failure");
            }
        })
    }
}