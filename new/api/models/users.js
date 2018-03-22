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
    createUser: (data) => {
        return new Promise((resolve, reject) => {
            if(data.username && data.password && data.email) {
                connection.query(`INSERT INTO Users (UserName, Password, Email)
                VALUES (?, ?, ?)`, [data.username, data.password, data.email],
                function(err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(results);
                        resolve(true);
                    }
                })
            } else {
                reject(false);
            }
        })
    },

    validateLogin: (data) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT Users.UserName FROM Users
            WHERE Users.UserName = ? AND Users.Password = ?`, [data.username, data.password],
            function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    if (results.length) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
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