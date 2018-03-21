'Use Strict';

var express = require('express');
var router = express.Router();

var dataController = require('../api/controllers/DataController');

var database = require('../api/models/database');

database.initConnect;

//create
router.post('/signup', function(req, res) {
    dataController.newUser(req, res);
})

//retrieve
router.get('/test'), function(req, res) {
    console.log("test2");
}

router.get('/login', function(req, res) {
    dataController.validateLogin(req, res);
})

router.get('/devices', function(req, res) {
   dataController.DeviceNames(req, res);
})

router.get('/device/:deviceid/rooms', function(req, res) {
    dataController.DeviceRooms(req, res);
})

router.get('/device/:deviceid/room/:roomid/lights', function(req, res) {
    dataController.RoomLights(req, res);
})

router.get('/device/:deviceid/room/:roomid/sensors', function(req, res) {
    dataController.RoomSensors(req, res);
})

router.get('/device/:deviceid/room/:roomid/sensor/:sensorid', function(req, res) {
    console.log("device lightsate reached");
    dataController.SensorState(req, res);
})



router.get('device123/:deviceid/room/:roomid/light/:lightid', function(req, res) {
    console.log("device lightsate reached");
    //dataController.LightState(req, res);
})


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

module.exports = router;
