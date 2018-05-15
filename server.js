const express       = require('express')
const bodyParser    = require('body-parser')
const config        = require('./config.json');

// Create the application
const app = express();
// Initialize port variable.
const port = process.env.PORT || config.webPort;

// Setup parser and faults.
app.use(bodyParser.json());

app.all('*', (req, res, next) => {
    console.log(req.method + " on " + req.url); // Stefan, moet je nog testen.
    next();                                     // Goto next
});

// API section.
app.use('/api', require('./routes/api'));

app.get('*', (req, res) => {
    res.status(404);
    res.send('404 - Not found');
});

// Setup port using port variable.
app.listen(port, () => {
    console.log('De server luistert naar port ' + port);
});