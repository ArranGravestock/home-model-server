'Use Strict';

var Request = require('tedious').Request;
var Connection = require('tedious').Connection;

var crypto = require('crypto');
var database = require('./database');

var connection = database.Connect();

let user = {
    "username": "",
    "password": "",
    "email": ""
}

hashPass = (password) => {
    crypto.createHmac('sha256', 'sdsadsa').update
    crypto.pbkdf2('secret', 'salt', 100000, 512, 'sha512', (err, derviedKey) => {
        if (err) throw err;
       
        let hashedpass = derviedKey.toString('hex');
        //console.log(hashedpass);
        return hashedpass;
    })
   
}

module.exports = {
    //hashedPass = hashPass("test"); //causes error undefined ???
        //console.log(hashedPass); //undefined??????
    createUser: (data, callback) => {
        if(data.username && data.password && data.email) {
            request = new Request(`INSERT INTO Users (UserName, Password, Email)
            VALUES ('${data.username}', '${data.password}', '${data.email}')`,
            function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(true);
                }
            })
            connection.execSql(request);
        } else {
            callback(false);
        }
    },

    validateLogin: (data, callback) => {      
        request = new Request(`SELECT Users.UserName FROM Users
        WHERE Users.UserName = '${data.username}' AND Users.Password = '${data.password}'`,
        function(err, rowCount) {
            if (err) {
                callback(err);
            } else {
                if (rowCount >= 1) {
                    callback(true);
                } else {
                    callback(false);
               }
            }
        })
        connection.execSql(request);
    }
}