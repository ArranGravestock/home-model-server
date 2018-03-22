'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');
var connection = database.Connect();

module.exports = {
    LightState: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Lights.LightID, Lights.LightName, Lights.LightState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
            RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
            WHERE Devices.DeviceID = ? AND Rooms.RoomID = ? AND Lights.LightID = ?`, [req.deviceid, req.roomid, req.lightid],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if(!results.length) {
                        reject(false);
                    } else {
                        resolve(results);
                    }
                }
            })
        })
    }
}