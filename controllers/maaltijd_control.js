const assert = require('assert')
const db = require('../db/db_connector')
const auth =  require('../auth/authentication');

module.exports = {
    createMaaltijd(req, res, next){
        assert(req.body.naam, 'naam must be provided')
        assert(req.body.beschrijving, 'beschrijving must be provided')
        assert(req.body.ingredienten, 'ingredienten must be provided')
        assert(req.body.allergie, 'allergie must be provided')
        assert(req.body.prijs, 'prijs must be provided')
        const id = req.params.id ||'';
        const name = req.body.naam
        const description = req.body.beschrijving
        const ingredients = req.body.ingredienten
        const allergies = req.body.allergie
        const price = req.body.prijs
        var token = (req.header('X-Access-Token')) || '';
        auth.decodeToken(token, (err, payload) => {
            const query = {
                sql: 'INSERT INTO maaltijd(Naam,Beschrijving,Ingredienten,Allergie,Prijs,UserId,StudentenhuisID) VALUES (?, ?,?,?,?,?,?)',
                values: [name,description,ingredients,allergies,price,payload.id,id],
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

        });
    },
    getAlleMaaltijden(req, res, next){
        const id = req.params.id ||'';
        const query = {
            sql: 'SELECT * FROM maaltijd WHERE StudentenhuisID = ?',
            values: id,
            timeout: 2000
        };

        console.log('QUERY: ' + query.sql);

        db.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString());
            } else {
                res.status(200).json(rows);
            }
        });
    },
    getMaaltijd(req, res, next){
        const id = req.params.id || '';
        const maaltijdid = req.params.maaltijdid || '';
        const query = {
            sql: 'SELECT * FROM maaltijd WHERE StudentenhuisID = ? and ID=?',
            values: [id, maaltijdid],
            timeout: 2000
        };
        console.log('QUERY: ' + query.sql);

        db.query(query, (error, rows, fields) => {
            if (error) {
                res.status(500).json(error.toString());
            } else {
                res.status(200).json(rows);
            }
        });
    },
    updateMaaltijd(req, res, next){
        assert(req.body.naam, 'naam must be provided');
        assert(req.body.beschrijving, 'beschrijving must be provided');
        assert(req.body.ingredienten, 'ingredienten must be provided');
        assert(req.body.allergie, 'allergie must be provided');
        assert(req.body.prijs, 'prijs must be provided');
        const maaltijdid= req.params.maaltijdid||'';
        const id = req.params.id ||'';
        const name = req.body.naam;
        const description = req.body.beschrijving;
        const ingredients = req.body.ingredienten;
        const allergies = req.body.allergie;
        const price = req.body.prijs;
        if (id && maaltijdid)
        {
            const query = {
                sql: 'UPDATE maaltijd SET Naam = ?, Beschrijving = ?, Ingredienten = ?, Allergie = ?,Prijs = ? WHERE ID = ?',
                values: [name, description, ingredients, allergies, price, maaltijdid],
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
    deleteMaaltijd(req, res, next){
        const maaltijdid = req.params.maaltijdid ||'';
        const id = req.params.id ||'';
        if (id && maaltijdid)
        {
            const querydeelnemers = {
                sql: 'DELETE FROM maaltijd WHERE ID = ?',
                values: id,
                timeout: 2000
            };
            console.log('QUERY: ' + querydeelnemers.sql);
            db.query( querydeelnemers, (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            });
        }

    }
}