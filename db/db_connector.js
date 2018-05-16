const mysql = require('mysql');
const config = require('../config');

let db = mysql.createConnection( {
    host            : process.env.DB_HOST       || config.dbHost,
    user            : process.env.DB_USER       || config.dbUser,
    password        : process.env.DB_PASSWORD   || config.dbPassword,
    database        : process.env.DB_DATABASE   || config.dbDatabase,
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