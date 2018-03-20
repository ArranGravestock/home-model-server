'Use Strict';
var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var TYPES = require('tedious').TYPES;
let userModel = require('../models/users');

var crypto = require('crypto');

exports.Connect = function() {
    var config = {
        userName: 'sa', //use new account with permission rather than sa
        password: 'testpassword123',
        server: 'localhost',
        options: {
            database: 'home-model'
        }
    }

    var connection = new Connection(config);

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected');
        }
    });
}

exports.newUser = function(req, res) {
    console.log("new user(s) initiated...");   
    console.log(userModel.createUser(req.query));
    
    if(userModel.createUser(req.query)) {
        console.log("test")
        res.statusCode = 200;
        res.send('Success');
    } else {
        res.statusCode = 500;
        res.send('Error processing request');
    }
}

exports.checkLogin = function(req, res, username, password) {
    var hashedpass = hashPass(password);

    request = new Request(`SELECT Users.UserName FROM Users
    WHERE Users.UserName = ${username} AND Users.Password = ${hashedpass}`,
    function(err, rowCount) {
        if(err) {
            console.log(err);
            return err;
        } else {
            console.log(`${rowCount} row(s) returned`);
            if (rowCount) {
                return true;
            } else {
                return false;
            }
        }
    })
    connection.execSql(request);
}

exports.DeviceNames = function(req, res) {
    request = new Request(`SELECT Devices.DeviceName FROM Devices`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log(`${rowCount} row(s) returned`);
            //if sending int use .toString() e.g. res.send(rowCount.toString());
            return rowCount;
        }
    })

    var test = [];
    request.on('row', function(columns) {
        columns.forEach(column => {
            test.push(column.value);
        });
    })   

    connection.execSql(request);
    
}

exports.DeviceRooms = function(req, res, device) {
    request = new Request(`SELECT Rooms.RoomName
    FROM Rooms
    RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
    WHERE Devices.DeviceName = '${device}'`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log(`${rowCount} row(s) returned`);
            return rowCount;
        }
    })

    connection.execSql(request);  
}

exports.RoomLights = function(req, res, device, room) {
    request = new Request(
    `SELECT Rooms.RoomName, Lights.LightName, Lights.LightState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
    WHERE Devices.DeviceName = '${device}' AND Rooms.RoomName = '${room}'`,
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            return(rowCount);
        }
    })

    connection.execSql(request);
}

exports.RoomSensors = function(req, res, device, room) {
    request = new Request(
    `SELECT Rooms.RoomName, Sensors.SensorName, Sensors.SensorState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
    WHERE Devices.DeviceName = '${device}' AND Rooms.RoomName = '${room}'`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            return(rowCount);
        }
    })

    connection.execSql(request);
}

exports.Sensor = function(req, res, device, room, sensor) {
    request = new Request(
    `SELECT Sensors.SensorID, Sensors.SensorName, Sensors.SensorState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
    WHERE Devices.DeviceName = '${device}' AND Rooms.RoomName = '${room}' AND Sensors.SensorName = '${sensor}'`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            return(rowCount);
        }
    })

    connection.execSql(request);
}

exports.Light = function(req, res, device, room, light) {
    request = new Request(
    `SELECT Lights.LightID, Lights.LightName, Lights.LightState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
    WHERE Devices.DeviceName = '${device}' AND Rooms.RoomName = '${room}' AND Lights.LightName = '${light}'`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
            return(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            return(rowCount);
        }
    })

    connection.execSql(request);  
}