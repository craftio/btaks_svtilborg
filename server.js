const config = require('./config.json');
const express = require('express');

//Create the application
const app = express();

app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretKey);

//Catch all
app.all('*', function(req, res, next) {
    console.log( req.method + " on " + req.url); //IK WIL TESTEN WAT DIT DOET VOOR ACCURATE DESC MAAR KON NIET SNEL AUTH WERKEND KRIJGEN
    next(); //Goto next
});

app.use('/api/register', require('./routes/register'));

app.listen(config.webPort, function () {
    console.log("Server running on port" + config.webPort);
});

module.exports = app;