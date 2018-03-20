'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var crypto = require('crypto');

//var database = require('./database');

let user = {
    "username": "",
    "password": "",
    "email": ""
}

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

hashPass = (password) => {
    crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, derviedKey) => {
        if (err) throw err;
        let hashedpass = derviedKey.toString('hex');
        //console.log(hashedpass);
        return hashedpass;
    })
}

module.exports = {
    createUser: (data) => {

        request = new Request(`INSERT INTO Users (UserName, Password, Email)
        VALUES ('${data.username}', '${hashPass(data.password)}', '${data.email}')`,
        function(err) {
            if (err) {
                console.log(err)
                return false;
            } else {
                //result = true;
                //console.log(result);
                return true;
            }
        })

        // request.on('done', function() {
        //     console.log("reqeus done");
        //     result = true;
        // })

        connection.execSql(request);
    }
}