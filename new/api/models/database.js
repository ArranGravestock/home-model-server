var Request = require('tedious').Request;
var Connection = require('tedious').Connection;
var TYPES = require('tedious').TYPES;

exports.Connect = function() {
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
}