var mysql = require('mysql');

var connection = mysql.createConnection({
    user: 'root', //use new account with permission rather than sa
    password: '',
    host: 'localhost',
    database: 'home_model'
})

exports.initConnection = function() {
    connection.connect(function(err) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Connected to database...");
        }
    })
}

exports.Connect = function() {
    return connection;
}