const studentenhuis = require('../model/studentenhuis')
const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');
const dateTime = require("node-datetime");


module.exports = {
    createStudentenhuis(req, res, next) {
        assert(req.body.naam, 'firstname must be provided');
        assert(req.body.adres, 'lastname must be provided');
        const name = req.body.naam;
        const adres = req.body.adres;
        var token = (req.header('X-Access-Token')) || '';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'INSERT INTO studentenhuis(Naam, Adres, UserID) VALUES (?, ?, ?)',
                values: [name, adres, payload.id],
                timeout: 2000
            };
            console.log(payload);
            console.log('QUERY: ' + query.sql);
            db.query(query, (error, rows, fields) => {
                if (error) {
                    res.status(412).json({"message":"Een of meer properties in de request body ontbreken of zijn foutief","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                } else {
                    res.status(200).json({"ID":rows.insertId,"naam":name,"adres":adres,"contact":payload.id,"email":payload.email});
                    // const giveContactQuery = {
                    //     sql: 'SELECT ID, Voornaam, Achternaam, Email FROM user WHERE ID = ' + payload.id,
                    //     timeout: 2000
                    // };
                    // db.query(giveContactQuery, (error, rows, fields) => {
                    //     if (error) {
                    //         res.status(500).json(error.toString());
                    //     } else {
                    //         res.status(200);
                    //         res.send(rows);
                    //     }
                    // });
                }
            });
        });
    },
    getAlleStudentenhuizen(req, res, next) {
        const query = {
            sql: 'SELECT * FROM view_studentenhuis',
            timeout: 2000
        };
        console.log('QUERY: ' + query.sql);
        db.query( query, (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString())
            } else {
                res.status(200).json(rows)
            }
        });
    },
    getStudentenhuis(req, res, next)
    {
        const id = req.params.id || '';
        if (id) {
            const query = {
                sql: 'SELECT * FROM view_studentenhuis WHERE ID = ?',
                values: id,
                timeout: 2000
            };
            console.log('QUERY: ' + query.sql);
            db.query( query, (error, rows, fields) => {
                if (error) {
                    res.status(404).json({"message":"Niet gevonden (huisId bestaat niet)","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                } else {
                    res.status(200).json(rows);
                }
            });
        }
        else
        {
            this.getAlleStudentenhuizen;
        }
    },
    updateStudentenhuis(req, res, next) {
        const id = req.params.id || '';
        const token = (req.header('X-Access-Token')) || '';
        const payload = auth.decodeToken(token, (err, payload) => {
            const getUIDQuery = {
                sql: "SELECT `user`.`ID`, `user`.`Voornaam`" +
                "FROM `studentenhuis`" +
                "JOIN `user`" +
                "ON `user`.`ID` = `studentenhuis`.`userID`" +
                "WHERE `studentenhuis`.`ID` = " + id,
                timeout: 2000
            };
            db.query( getUIDQuery, (error, result) => {
                if (error || result[0].ID !== payload.id) {
                    res.status(409).json({"message":"Conflict (Gebruiker mag deze data niet wijzigen)","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                } else {
                    assert(req.body.naam, 'firstname must be provided');
                    assert(req.body.adres, 'lastname must be provided');
                    const name = req.body.naam;
                    const adres = req.body.adres;
                    const userName = result[0].Voornaam;
                    const query = {
                        sql: 'UPDATE studentenhuis SET Naam = ?, Adres = ? WHERE ID = ?',
                        values: [name, adres, id],
                        timeout: 2000
                    };
                    console.log('QUERY: ' + query.sql);

                    db.query( query, (error, rows, fields) => {
                        if (error) {
                            res.status(500).json(rows)
                        } else {
                            res.status(200).json({
                                "ID": id,
                                "naam": name,
                                "adres": adres,
                                "contact": userName,
                                "email": payload.email
                            });
                        }
                    });
                }
            });
        });
    },
    deleteStudentenhuis(req, res, next) {
        const id = req.params.id || '';
            const checkQuery = {
                sql: "SELECT `studentenhuis`.`ID`" +
                "FROM `studentenhuis`" +
                "WHERE `studentenhuis`.`ID` = " + id,
                values: id,
                timeout: 2000
            };
            console.log('QUERY: ' + checkQuery.sql);
            db.query( checkQuery, (error, results) => {
                if (error || results === undefined || results[0] === undefined || results[0].ID === null) {
                    res.status(404).json({"message":"Niet gevonden (huisId bestaat niet)","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                } else {
                    const checkQuery = {
                        sql: "SELECT `user`.`ID`, `user`.`Voornaam` " +
                        "FROM `studentenhuis` " +
                        "JOIN `user` " +
                        "ON `user`.`ID` = `studentenhuis`.`userID` " +
                        "WHERE `studentenhuis`.`ID` = " + id,
                        values: id,
                        timeout: 2000
                    };
                    const token = (req.header('X-Access-Token')) || '';
                    const payload = auth.decodeToken(token, (err, payload) => {
                        console.log('QUERY: ' + checkQuery.sql);
                        db.query( checkQuery, (error, results) => {
                            if (results[0].ID != payload.id) {
                                res.status(409).json({"message":"Conflict (Gebruiker mag deze data niet wijzigen)","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                            } else {
                                const deelnemerQuery = {
                                    sql: 'DELETE FROM deelnemers WHERE StudentenhuisID = ?',
                                    values: id,
                                    timeout: 2000
                                };
                                console.log('QUERY: ' + deelnemerQuery.sql);
                                db.query( deelnemerQuery, (error, rows, fields) => {
                                });
                                const maaltijdQuery = {
                                    sql: 'DELETE FROM maaltijd WHERE StudentenhuisID = ?',
                                    values: id,
                                    timeout: 2000
                                };
                                console.log('QUERY: ' + maaltijdQuery.sql);
                                db.query(maaltijdQuery, (error, rows, fields) => {
                                });
                                const query = {
                                    sql: 'DELETE FROM studentenhuis WHERE ID = ?',
                                    values: id,
                                    timeout: 2000
                                };
                                console.log('QUERY: ' + query.sql);
                                db.query(query, (error, rows, fields) => {
                                    if (error) {
                                        res.status(500).json(error.toString())
                                    } else {
                                        res.status(409).json({"message":"Studentenhuis succesvol verwijderd","code":0,"datetime":dateTime.create().format('Y-m-d H:M:S')});
                                    }
                                });
                            }
                        });
                    });
                }
            });
    }
};