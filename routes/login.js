const config = require('../config.json');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const dateTime = require("node-datetime");
const mysql = require('mysql');
const auth =  require('../auth/authentication');


//Parse 'extended: true' as url encoded text
app.use(bodyParser.urlencoded({
    extended: true
}));

//Parse the next things to parse as json
router.use(bodyParser.json());

router.post("/", function (req, res) {
    let email = req.body.email || null;
    let pWord = req.body.password || null;
    console.log("Login: " + email + ", " + pWord);

    //Create connection configuration
    const con = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPass,
        database: config.dbDatabase
    });

    let sql = "SELECT Password FROM user WHERE Email = '" + email + "'";

        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result !== undefined && result[0] !== undefined && result[0].Password.toString() === pWord) {
                res.status(200);
                res.json({"token": auth.encodeToken(email), "email": email});
            } else {
                res.status(412);
                res.json({
                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                    "code": 0,
                    "datetime": dateTime.create().format('Y-m-d H:M:S')
                });
            }
        });
    });

module.exports = router;