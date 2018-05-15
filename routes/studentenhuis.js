const config = require('../config.json');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const dateTime = require("node-datetime");
const mysql = require('mysql');
const jwt = require('jwt-simple');

//Parse 'extended: true' as url encoded text
app.all(bodyParser.urlencoded({
    extended: true
}));

//Parse the next things to parse as json
router.use(bodyParser.json());

router.post("/", function (req, res) {

    //Get/set all given(received) parameters
    let name = req.body.naam || null;
    let address = req.body.adres || null;
    //Get email from token
    let email = jwt.decode(req.header('X-Access-Token'), Buffer(config.secretKey)).sub;

    //Create MySQL connection configuration
    const con = mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPass,
        database: config.dbDatabase
    });

    //Create SQL Statement
    let sql = "SELECT ID, Voornaam FROM user WHERE Email = '" + email + "'";

    //Create connection
    con.connect(function (err) {
        if (err) throw err; //                  Throw something as output too!!! (maybe only output)

        con.query(sql, function (err, result) {
            if (err) throw err; //               Throw something as output too!!! (maybe only output)
            if (result === undefined || result[0].ID === undefined || result[0].Voornaam === undefined) {
                res.status(412);
                res.json({
                    "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                    "code": 0,
                    "datetime": dateTime.create().format('Y-m-d H:M:S')
                });
            } else {
                let userID = result[0].ID;
                let naam = result[0].Voornaam;
                con.query(sql, function (err) {
                    if (err) throw err; //        Throw something as output too!!! (maybe only output)
                    console.log("Connected!");
                    sql = "INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES ('" + name + "', '" + address + "', '" + userID + "')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        res.status(200); //Status 200 = OK
                        //Create token and send
                        res.json({"ID": result.insertId, "naam": naam, "adres": address, "contact": naam, "email": email});
                    });
                });
            }
        });
    });
});

//     //If there IS something wrong with the parameters
//     else {
//         let message = "Oeps! Er is iets foutgegaan met de meegegeven waarden. Probeer het opnieuw!";
//         if (fName == null || lName == null) {
//             message = "Je bent je naam vergeten in te vullen!";
//         } else if (!String(email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
//             message = "Check je email!";
//         } else if (pWord == null) {
//             message = "Je hebt geen wachtwoord ingevuld!";
//         }
//         res.status(412); //Status 412 = one or more parameters of the request body are missing or faulty
//         //Create error message JSON and send
//         res.json({"message":message,"code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
//     }
// });

module.exports = router;