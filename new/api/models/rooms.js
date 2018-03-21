'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');

var connection = database.Connect();

module.exports = {
    RoomLights: (req, callback) => {
        console.log("room lights executed");
        request = new Request(
        `SELECT Rooms.RoomName, Lights.LightName, Lights.LightState
        FROM Devices
        RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
        RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
        WHERE Devices.DeviceID = '${req.deviceid}' AND Rooms.RoomID = '${req.roomid}'`,
        function(err, rowCount) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(`${rowCount} row(s) returned`);
                callback(rowCount);
            }
        })
        connection.execSql(request);
    },

    RoomSensors: (req, callback) => {
        request = new Request(
        `SELECT Rooms.RoomName, Sensors.SensorName, Sensors.SensorState
        FROM Devices
        RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
        RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
        WHERE Devices.DeviceID = '${req.deviceid}' AND Rooms.RoomID = '${req.roomid}'`, 
        function(err, rowCount) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(`${rowCount} row(s) returned`);
                callback(rowCount);
            }
        })
        connection.execSql(request);  
    }
}