'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    RoomLights: (req, callback) => {
        connection.query(
        `SELECT Rooms.RoomName, Lights.LightName, Lights.LightState
        FROM Devices
        RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
        RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
        WHERE Devices.DeviceID = '${req.deviceid}' AND Rooms.RoomID = '${req.roomid}'`,
        function(err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                console.log(`${data} row(s) returned`);
                callback(data);
            }
        })
    },

    RoomSensors: (req, callback) => {
        connection.query(
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
    }
}