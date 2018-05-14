var config = require('./config.json');
var express = require('express');

//Create the application
var app = express();

app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretKey);

//Catch all
app.all('*', function(req, res, next) {
    console.log( req.method + " " + req.url); //IK WIL TESTEN WAT DIT DOET VOOR ACCURATE DESC MAAR KON NIET SNEL AUTH WERKEND KRIJGEN
    next(); //Goto next
});

app.use('/api/register', require('./routes/auth'));