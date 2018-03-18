var express = require('express');
var app = express();

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

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
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
            //if sending int use .toString() e.g. res.send(rowCount.toString());
        }
    })

    var test = [];
    request.on('row', function(columns) {
        columns.forEach(column => {
            console.log(column.value);
            test.push(column.value);
        });
        console.log(test);
    })
    
    request.on('done', function() {
        
    })
    res.send("Request complete");

    connection.execSql(request); 

})

app.get('/:device/rooms', function(req, res) {
    request = new Request(`SELECT Rooms.RoomName
    FROM Rooms
    RIGHT JOIN Devices on Devices.DeviceID = Rooms.DeviceID
    WHERE Devices.DeviceName = '${req.params.device}'`, 
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
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
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
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
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
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
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
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
    function(err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            console.log(`${rowCount} row(s) returned`);
        }
    })
    connection.execSql(request);  
})

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;
})