'Use Strict';

var express = require('express');
var router = express.Router();

var dataController = require('../api/controllers/DataController');

//dataController.Connect;

router.get('/testhash', function(req, res) {
    res.send(dataController.checkLogin(req, res, 'test', 'testpass'));
})

router.get('/login', function(req, res) {

})

router.post('/signup', function(req, res) {
   dataController.newUser(req, res);
})
/*
router.get('/devices', function(req, res) {
    res.send(dataController.DeviceNames());
})

router.get('/:device/rooms', function(req, res) {
    res.send(dataController.DeviceRooms(res, res, req.params.device));
})

router.get('/:device/:room/lights', function(req, res) {
    res.send(dataController.RoomLights(req, res, req.params.device, req.params.room));
})

router.get('/:device/:room/sensors', function(req, res) {
    res.send(dataController.RoomSensors(req, res, req.params.device, req.params.room));
})

router.get('/:device/:room/sensors/:sensor', function(req, res) {
    res.send(dataController.Sensor(req, res, req.params.device, req.params.room, req.params.sensor));
})

router.get('/:device/:room/lights/:light', function(req, res) {
    res.send(dataController.Light(req, res, req.params.device, req.params.room, req.params.light));
})
*/

/*
var fs = require("fs");``
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
/*
app.put('/:device/reading', function(req, res) {
    request = new Request(`INSERT INTO Rooms (DeviceID, RoomName)
    VALUES ('${req.params.device}', 'bedroom')`,
        function(err, rowCount) {
            if (err) {
                console.log(err);
            } else {
                res.send(`${rowCount} (s) inserted`)
                console.log(`${rowCount} (s) inserted`);
            }
        }
    )
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

app.get('/:device/rooms/:room/sensors/:sensor', function(req, res) {
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

//var server = app.listen(8080, function() {
  //  var host = server.address().address;
   // var port = server.address().port;
//})

/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

module.exports = router;
