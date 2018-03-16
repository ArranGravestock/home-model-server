var express = require('express');
var app = express();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
  userName: 'testdbuser',
  password: 'testdbuser123',
  server: 'DESKTOP-CCNMN09'
}

var connection = new Connection(config);

var fs = require("fs");
app.get('/', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        console.log(data);
        res.end(data);
    })
})
/*
app.get('/:device', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var device = JSON.parse(data);
        console.log(device);
        for (var i = 0; i < device.length; i++) {
            if (device[i] == req.params.device) {
                console.log(device[i])
            }
        }
        var rooms = device[req.params.device][0]
        //console.log(rooms);
        res.end(JSON.stringify(rooms));
    })
})
*/

app.get('/:device/:roomid', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var device = JSON.parse(data);
        var rooms = device[req.params.device]
        var room_items = rooms[req.params.roomid]
        console.log(room_items);
        res.end(JSON.stringify(room_items));
    })
})

app.get('/devices', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(`select Devices.DeviceName 
            FROM Devices `, 
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

app.get('/:device/rooms', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(`SELECT Rooms.RoomName
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
            WHERE Devices.DeviceID = ${req.params.device}`, 
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

app.get('/:device/:room/lights', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(
            `SELECT Rooms.RoomName, Lights.LightName, Lights.LightState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
			RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
            WHERE Devices.DeviceID = ${req.params.device} AND Lights.RoomID = ${req.params.room}`,
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

app.get('/:device/:room/sensors', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(`SELECT Sensors.SensorID, Sensors.SensorName, sensors.SensorState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
			RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
            WHERE Devices.DeviceID = ${req.params.device} AND Sensors.RoomID = ${req.params.room}`, 
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

app.get('/:device/:room/:sensor', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(`SELECT Sensors.SensorID, Sensors.SensorName, sensors.SensorState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
			RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
            WHERE Devices.DeviceID = ${req.params.device} AND Sensors.RoomID = ${req.params.room} AND Sensors.SensorID = ${req.params.sensor}`, 
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

app.get('/:device/:room/:light', function(req, res) {

    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            request = new Request(`SELECT Sensors.SensorID, Sensors.SensorName, sensors.SensorState
            FROM Devices
            RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
			RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
            WHERE Devices.DeviceID = ${req.params.device} AND Sensors.RoomID = ${req.params.room} AND Lights.SensorID = ${req.params.light}`, 
            function(err, sensors) {
                if (err) {
                    console.log(err);
                } else {
                    var data = sensors;
                    console.log(data);
                    res.send(data);
                }
            })
            connection.close();
        }
    })
})

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
})