'Use Strict';

var crypto = require('crypto');

var database = require('./database');
var connection = database.Connect();

let user = {
    "username": "",
    "password": "",
    "email": ""
}

module.exports = {
    //hashedPass = hashPass("test"); //causes error undefined ???
        //console.log(hashedPass); //undefined??????
    createUser: (data, callback) => {
        if(data.username && data.password && data.email) {
            connection.query(`INSERT INTO Users (UserName, Password, Email)
            VALUES ('${data.username}', '${data.password}', '${data.email}')`,
            function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(true);
                }
            })
        } else {
            callback(false);
        }
    },

    validateLogin: (data, callback) => {
        connection.query(`SELECT Users.UserName FROM Users
        WHERE Users.UserName = '${data.username}' AND Users.Password = '${data.password}'`,
        function(err, results) {
            if (err) {
                callback(err);
            } else {
                if (results >= 1) {
                    callback(true);
                } else {
                    callback(false);
               }
            }
        })
    }
}

/*
hashPass = (password) => {
    crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, derviedKey) => {
        if (err) throw err;
       
        let hashedpass = derviedKey.toString('hex');
        console.log(hashedpass);
        return hashedpass;
    })
}
*/