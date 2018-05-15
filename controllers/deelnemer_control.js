const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createDeelnemers(req, res, next){
        var token = (req.header('X-Access-Token')) || '';
        const maaltijdId = req.params.maaltijdid ||'';
        const id = req.params.id || '';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'INSERT INTO deelnemers(UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?, ?)',
                values: [payload.id,id,maaltijdId],
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

        });
    },
    getDeelnemers(req, res, next)
    {
        const id = req.params.id ||'';
        const maaltijdid= req.params.maaltijdid||'';
        const query = {
            sql: 'SELECT * FROM view_deelnemers WHERE StudentenhuisID = ? AND MaaltijdID = ?' ,
            values: [id, maaltijdid],
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
    deleteDeelnemer(req, res, next){
        var token = (req.header('X-Access-Token')) || '';
        const maaltijdid = req.params.maaltijdid || '';
        const id = req.params.id || '';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'DELETE from deelnemers where UserID = ? AND StudentenhuisID =? AND MaaltijdID = ?',
                values: [payload.id, id, maaltijdid],
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

        });
    }
}