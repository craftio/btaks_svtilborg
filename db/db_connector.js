const mysql = require('mysql');
const config = require('../config');

let db = mysql.createConnection( {
    host            : config.dbHost,
    user            : config.dbUser,
    password        : config.dbPassword,
    database        : config.dbDatabase,
});

//console.log(db.host);

db.connect( (error) => {
    if(error) {
        console.log(error);
        return;
    } else {
        console.log("Connected to databasehost " + config.dbHost + ' for database ' + config.dbDatabase);
    }
});

module.exports = db;