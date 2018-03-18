var express = require('express');
var app = express();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var sql = require('mssql');

var config = {
    userName: 'sa', //use new account with permission rather than sa
    password: 'testpassword123',
    server: 'localhost',
    options: {
        database: 'home-model'
    }
  }



var connection = new Connection(config);

connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected');
    }
});

/*
var fs = require("fs");
app.get('/test', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var test = JSON.parse(data);
        console.log(test);
        res.end(data);
    })
})

app.get('/:device/:roomid', function(req, res) {
    fs.readFile(__dirname + "/" + "server_test.json", 'utf8', function(err, data) {
        var device = JSON.parse(data);
        var rooms = device[req.params.device]
        var room_items = rooms[req.params.roomid]
        console.log(room_items);
        res.end(JSON.stringify(room_items));
    })
})
*/

app.get('/devices', function(req, res) {
    request = new Request(`SELECT Devices.DeviceName FROM Devices`, 
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            var data = sensors;
            console.log(data);
            console.log("request sent");
            res.send(data.toString());
        }
    })
    connection.execSql(request);  
})

app.get('/:device/rooms', function(req, res) {
    console.log("executing request /:device/rooms");
    request = new Request(`SELECT Rooms.RoomName
    FROM Rooms
    RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
    WHERE Devices.DeviceName = '${req.params.device}'`, 
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            console.log("executed");
            var data = sensors;
            console.log(data.toString());
            res.send(data.toString());
        }
    })
    connection.execSql(request);  
})

app.get('/:device/:room/lights', function(req, res) {
    request = new Request(
    `SELECT Rooms.RoomName, Lights.LightName, Lights.LightState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
    WHERE Devices.DeviceName = '${req.params.device}' AND Rooms.RoomName = '${req.params.room}'`,
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            var data = sensors;
            console.log(data);
            res.send(data.toString());
        }
    })
    connection.execSql(request);   
})

app.get('/:device/:room/sensors', function(req, res) {
    request = new Request(
    `SELECT Rooms.RoomName, Sensors.SensorName, Sensors.SensorState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
    WHERE Devices.DeviceName = '${req.params.device}' AND Rooms.RoomName = '${req.params.room}'`, 
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            var data = sensors;
            console.log(data);
            res.send(data.toString());
        }
    })
    connection.execSql(request);  
})

app.get('/:device/:room/sensors/:sensor', function(req, res) {
    request = new Request(
    `SELECT Sensors.SensorID, Sensors.SensorName, Sensors.SensorState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Sensors on Rooms.RoomID = Sensors.RoomID
    WHERE Devices.DeviceName = '${req.params.device}' AND Rooms.RoomName = '${req.params.room}' AND Sensors.SensorName = '${req.params.sensor}'`, 
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            var data = sensors;
            console.log(data);
            res.send(data.toString());
        }
    })
    connection.execSql(request);  
})

app.get('/:device/:room/lights/:light', function(req, res) {
    request = new Request(
    `SELECT Lights.LightID, Lights.LightName, Lights.LightState
    FROM Devices
    RIGHT JOIN Rooms on Devices.DeviceID = Rooms.DeviceID
    RIGHT JOIN Lights on Rooms.RoomID = Lights.RoomID
    WHERE Devices.DeviceName = '${req.params.device}' AND Rooms.RoomName = '${req.params.room}' AND Lights.LightName = '${req.params.light}'`, 
    function(err, sensors) {
        if (err) {
            console.log(err);
        } else {
            var data = sensors;
            console.log(data);
            res.send(data.toString());
        }
    })
    connection.execSql(request);  
})

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
})