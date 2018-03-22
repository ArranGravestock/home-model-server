'Use Strict';

var database = require('./database');

var connection = database.Connect();

module.exports = {
    SensorState: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(
            `SELECT Sensors.SensorID, Sensors.SensorName, Sensors.SensorState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
            RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
            WHERE Devices.DeviceID = ? AND Rooms.RoomID = ? AND Sensors.SensorID = ?`, [req.deviceid, req.roomid, req.sensorid],
            function(err, results) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    if(!results.length) {
                        reject(false);
                    } else {
                        console.log(results);
                        resolve(results);
                    }
                }
            })
        })
    }
}