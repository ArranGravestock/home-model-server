'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    getDevices: () => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Devices.DeviceName FROM Devices`, 
            function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    },

    getDeviceRooms: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Rooms.RoomName
            FROM Rooms
            RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
            WHERE Devices.DeviceID = '${req.deviceid}'`, 
            function(err, data) {
                if (err) {
                    reject(err)
                } else {
                    if(data.length == 0) {
                        reject(data);
                    } else {
                        resolve(data);
                    }
                }
            }) 
        })
    }
}