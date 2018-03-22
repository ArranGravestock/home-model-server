'Use Strict';

var database = require('./database');
var connection = database.Connect();

module.exports = {
    getDevices: () => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Devices.DeviceName FROM Devices`, 
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (!results.length) {
                        reject('Could not find any devices!');
                    } else {
                        resolve(results);
                    }
                }
            })
        });
    },

    getDeviceRooms: (req) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Rooms.RoomName
            FROM Rooms
            RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
            WHERE Devices.DeviceID = ?`, [req.deviceid], 
            function(err, results) {
                if (err) {
                    reject(err)
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