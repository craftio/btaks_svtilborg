const config = require('./config.json');
const express = require('express');
const auth = require("./auth/authentication");
const dateTime = require("node-datetime");

//Create the application
const app = express();

app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretKey);

//Catch all
app.all('*', function(req, res, next) {
    console.log( req.method + " on " + req.url); //IK WIL TESTEN WAT DIT DOET VOOR ACCURATE DESC MAAR KON NIET SNEL AUTH WERKEND KRIJGEN
    next(); //Goto next
});

app.all( new RegExp("[^(/apregistlon)]"), function (req, res, next) {
    //
    console.log("VALIDATE TOKEN");

    let token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(String(token), (err) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({"message": "Niet geauthoriseerd (geen valid token)", "code": 0, "datetime": dateTime.create().format('Y-m-d H:M:S')});
        } else {
            next();
        }
    });
});

app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));
app.use('/api/studentenhuis', require('./routes/studentenhuis'));

app.listen(config.webPort, function () {
    console.log("Server running on port" + config.webPort);
});

module.exports = app;