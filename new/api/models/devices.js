'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var database = require('./database');

var connection = database.Connect();

module.exports = {
    getDevices: (callback) => {
        request = new Request(`SELECT Devices.DeviceName FROM Devices`, 
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

    getDeviceRooms: (req, callback) => {
        request = new Request(`SELECT Rooms.RoomName
        FROM Rooms
        RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
        WHERE Devices.DeviceID = '${req.deviceid}'`, 
        function(err, rowCount) {
            if (err) {
                console.log(err);
                callback(err)
            } else {
                console.log(`${rowCount} row(s) returned`);
                callback(rowCount);
            }
        })
        connection.execSql(request);  
    }
}