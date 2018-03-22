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
            WHERE Devices.DeviceID = '${req.deviceid}' AND Rooms.RoomID = '${req.roomid}' AND Sensors.SensorID = '${req.sensorid}'`, 
            function(err, data) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log(`${data} row(s) returned`);
                    resolve(data);
                }
            })
        })
    }
}