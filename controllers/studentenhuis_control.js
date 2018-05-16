const studentenhuis = require('../model/studentenhuis')
const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createStudentenhuis(req, res, next){
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
                    res.status(500).json(error.toString());
                } else {
                    const giveContactQuery = {
                        sql: 'SELECT ID, Voornaam, Achternaam, Email FROM user WHERE ID = ' + payload.id,
                        timeout: 2000
                    };
                    db.query(giveContactQuery, (error, rows, fields) => {
                        if (error) {
                            res.status(500).json(error.toString());
                        } else {
                            res.status(200);
                            res.send(rows);
                        }
                    });
                }
            });
        });
    },
    getAlleStudentenhuizen(req, res, next){
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
                    res.status(500).json(error.toString());
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
    updateStudentenhuis(req, res, next)
    {
        const id = req.params.id || '';
        assert(req.body.naam, 'firstname must be provided');
        assert(req.body.adres, 'lastname must be provided');
        const name = req.body.naam;
        const adres = req.body.adres;
        if (id)
        {
            const query = {
                sql: 'UPDATE studentenhuis SET Naam = ?, Adres = ? WHERE ID = ?',
                values: [name, adres, id],
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
        }
        else
        {
            //error handling als er geen id gegeven is
        }
    },
    deleteStudentenhuis(req, res, next)
    {
        const id = req.params.id || '';
        if (id)
        {
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
                    res.status(200).json(rows)
                }
            });
        }
        else
        {
            //error handling als er geen id gegeven is
        }
    }
}