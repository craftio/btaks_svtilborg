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

    //Boolean will be set false if anything with the given parameters is wrong
    let accept = true;
    //Get/set all given(received) parameters
    let fName = req.body.firstname || null;
    let lName = req.body.lastname || null;
    let email = String(req.body.email) || null; //Casted to string because of regex check
    let pWord = req.body.password || null;
    //Check email with RFC5322 Official Standard regex, and check other parameters for not being null
    if (!String(email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) || fName == null || lName == null || pWord == null) {
        accept = false;
    }
    //If accept is true (nothing is wrong with given parameters)
    if (accept) {
        //Create connection configuration
        const con = mysql.createConnection({
            host: config.dbHost,
            user: config.dbUser,
            password: config.dbPass,
            database: config.dbDatabase
        });

        //Create SQL Statement
        let sql = "SELECT Email FROM user WHERE Email = '" + email + "'";

        //Execute query
            con.query(sql, function (err, result) {
                if (err) throw err; //               Throw something as output too!!! (maybe only output)
                if (result === undefined || result[0] !== undefined) {
                    res.status(412);
                    res.json({"message":"Er is al een account met dit email adres!","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                } else {
                    con.query(sql, function (err) {
                        if (err) throw err; //        Throw something as output too!!! (maybe only output)
                        sql = "INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES ('" + fName + "', '" + lName + "', '" + email + "', '" + pWord + "')";
                        con.query(sql, function (err) {
                            if (err) throw err;
                            res.status(200); //Status 200 = OK
                            //Create token and send
                            res.json({"token":auth.encodeToken(email),"email":email});
                        })
                    });
                }
            });
    }

    //If there IS something wrong with the parameters
    else {
        let message = "Oeps! Er is iets foutgegaan met de meegegeven waarden. Probeer het opnieuw!";
        if (fName == null || lName == null) {
            message = "Je bent je naam vergeten in te vullen!";
        } else if (!String(email).match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            message = "Check je email!";
        } else if (pWord == null) {
            message = "Je hebt geen wachtwoord ingevuld!";
        }
        res.status(412); //Status 412 = one or more parameters of the request body are missing or faulty
        //Create error message JSON and send
        res.json({"message":message,"code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
    }
});

module.exports = router;