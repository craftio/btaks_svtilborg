const express = require('express');
const routes = express.Router();
const auth =  require('../auth/authentication');
let gebruikerControl = require('../controllers/gebruiker_control');
let studentenhuisControl = require('../controllers/studentenhuis_control');
let maaltijdControl = require('../controllers/maaltijd_control');
let deelnemerControl = require('../controllers/deelnemer_control');

// Token validation
routes.all(new RegExp("[^(\/loginrgste)]"), (req, res, next) => {
    console.log("Token valideren...");
    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log("Error handler: " + err.message);
            res.status((err.status || 401 )).json({error: new Error("Ongeldige token.").message});
        } else {
            console.log("Token gevalideerd!");
            next();
        }
    });
});

// Swagger routes
routes.route('/login').post(gebruikerControl.LoginUser);
routes.route('/register').post(gebruikerControl.registerUser);
routes.post('/studentenhuis',studentenhuisControl.createStudentenhuis);
routes.get('/studentenhuis',studentenhuisControl.getAlleStudentenhuizen);
routes.get('/studentenhuis/:id',studentenhuisControl.getStudentenhuis);
routes.put('/studentenhuis/:id',studentenhuisControl.updateStudentenhuis);
routes.delete('/studentenhuis/:id',studentenhuisControl.deleteStudentenhuis);
routes.post('/studentenhuis/:id/maaltijd', maaltijdControl.createMaaltijd);
routes.get('/studentenhuis/:id/maaltijd',maaltijdControl.getAlleMaaltijden);
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid',maaltijdControl.getMaaltijd);
routes.put('/studentenhuis/:id/maaltijd/:maaltijdid',maaltijdControl.updateMaaltijd);
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid',maaltijdControl.deleteMaaltijd);
routes.post('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',deelnemerControl.createDeelnemers);
routes.get('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',deelnemerControl.getDeelnemers);
routes.delete('/studentenhuis/:id/maaltijd/:maaltijdid/deelnemers',deelnemerControl.deleteDeelnemer);

module.exports = routes;