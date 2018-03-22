'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');
var connection = database.Connect();

module.exports = {
    LightState: (req, callback) => {
        connection.query(
        `SELECT Lights.LightID, Lights.LightName, Lights.LightState
        FROM Devices
        RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
        RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
        WHERE Devices.DeviceID = '${req.deviceid}' AND Rooms.RoomID = '${req.roomid}' AND Lights.LightID = '${req.lightid}'`, 
        function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(data);
            }
        })
    }
}