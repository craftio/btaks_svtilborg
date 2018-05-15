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

//Create MySQL connection configuration
const con = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPass,
    database: config.dbDatabase
});

router.post("/", function(req, res) {

    //Get/set all given(received) parameters
    let name = req.body.naam || null;
    let address = req.body.adres || null;
    //Get email from token
    let email = jwt.decode(req.header('X-Access-Token'), Buffer(config.secretKey)).sub;

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

router.get("/", function(req, res) {
    const id  = req.params.id || '';

    let query = "SELECT `studentenhuis`.`ID`, `studentenhuis`.`Naam`, `studentenhuis`.`Adres`, `user`.`Voornaam`, `user`.`Email`" +
        "FROM `studentenhuis`" +
        "JOIN `user`" +
        "ON `user`.`ID` = `studentenhuis`.`userID`";

    con.query(query, function (err, result) {;
        if (err) throw err;
        if (result !== undefined && result[0] !== undefined) {
            let outputJson = {};
            let i = 0;
            result.forEach(function(item) {
                let recvID = item.ID;
                let recvNaam = item.Naam;
                let recvAdres = item.Adres;
                let recvContact = item.Voornaam;
                let recvEmail = item.Email;
                var dataAdd = {"ID" : recvID, "naam" : recvNaam, "adres" : recvAdres, "contact" : recvContact, "email" : recvEmail};
                outputJson[i] = dataAdd;
                i++;
            });
            res.status(200)
            res.json(outputJson);
        } else {
            res.status(412);
            res.json({
                "message": "Onbekende fout",
                "code": 0,
                "datetime": dateTime.create().format('Y-m-d H:M:S')
            });
        }
    })
});

router.get("/:id?", function(req, res) {
    const id  = req.params.id || '';

    let query = "SELECT `studentenhuis`.`ID`, `studentenhuis`.`Naam`, `studentenhuis`.`Adres`, `user`.`Voornaam`, `user`.`Email`" +
        "FROM `studentenhuis`" +
        "JOIN `user`" +
        "ON `user`.`ID` = `studentenhuis`.`userID`" +
        "WHERE `studentenhuis`.`ID` = " + id;

    con.query(query, function (err, result) {
        console.log("test2");
        if (err) throw err;
        if (result !== undefined && result[0] !== undefined) {
            result = result[0];
            let recvID = result.ID;
            let recvNaam = result.Naam;
            let recvAdres = result.Adres;
            let recvContact = result.Voornaam;
            let recvEmail = result.Email;
            res.status(200);
            res.json({"ID" : recvID, "naam" : recvNaam, "adres" : recvAdres, "contact" : recvContact, "email" : recvEmail});
        } else {
            res.status(412);
            res.json({
                "message": "Niet gevonden (huisId bestaat niet)",
                "code": 0,
                "datetime": dateTime.create().format('Y-m-d H:M:S')
            });
        }
    })
});

router.put("/:id?", function(req, res) {
    const id  = req.params.id || '';

    let checkQuery = "SELECT `user`.`Email`" +
        "FROM `studentenhuis`" +
        "JOIN `user`" +
        "ON `user`.`ID` = `studentenhuis`.`userID`" +
        "WHERE `studentenhuis`.`ID` = " + id;

    con.query(checkQuery, function (err, result) {
        if (err) throw err;
        if (result === undefined || result[0] === undefined) {
            res.status(412);
            res.json({
                "message": "Niet gevonden (huisId bestaat niet)",
                "code": 0,
                "datetime": dateTime.create().format('Y-m-d H:M:S')
            });
        } else {
            result = result[0];
            let userEmail = result.Email;
            let email = jwt.decode(req.header('X-Access-Token'), Buffer(config.secretKey)).sub;
            if (email != userEmail) {
                res.status(409);
                res.json({
                    "message": "Conflict (Gebruiker mag deze data niet wijzigen)",
                    "code": 0,
                    "datetime": dateTime.create().format('Y-m-d H:M:S')
                });
            } else {
                let naam = req.body.naam || null;
                let adres = req.body.adres || null;
                if (naam === null || adres === null) {
                    res.status(412);
                    res.json({
                        "message": "Een of meer properties in de request body ontbreken of zijn foutief",
                        "code": 0,
                        "datetime": dateTime.create().format('Y-m-d H:M:S')
                    });
                } else {
                    let query = "UPDATE `studentenhuis`" +
                        "SET `studentenhuis`.`Naam` = '" + naam + "', `studentenhuis`.`Adres` = '" + adres + "'" +
                        "WHERE `studentenhuis`.`ID` = " + id;

                    con.query(query, function (err) {
                        if (err) throw err;
                        res.status(200)
                        res.json({"temp" : "moet nog gemaakt worden"}); //HIER MOET NOG EEN QUERY OM ALLE INFO VAN HET GEWIJZIDGE STUDENTENHUIS TE SHOWEN
                    });
                }
            }

        }
        });
    });

module.exports = router;