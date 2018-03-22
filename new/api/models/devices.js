'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    getDevices: (callback) => {
        connection.query(`SELECT Devices.DeviceName FROM Devices`, 
        function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(data);
            }
        })
    },

    getDeviceRooms: (req, callback) => {
        connection.query(`SELECT Rooms.RoomName
        FROM Rooms
        RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
        WHERE Devices.DeviceID = '${req.deviceid}'`, 
        function(err, data) {
            if (err) {
                callback(err)
            } else {
                callback(data);
            }
        }) 
    }
}