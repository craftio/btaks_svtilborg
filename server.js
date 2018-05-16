const express       = require('express')
const bodyParser    = require('body-parser')
const config        = require('./config.json');
const path          = require('path');

// Create the application
const app = express();
// Initialize port variable.
const port = process.env.PORT || config.webPort;

// Setup parser and faults.
app.use(bodyParser.json());

// API section.
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
    res.status(200);
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('404 - Not found');
});

app.all('*', (req, res, next) => {
    next();
});

// Setup port using port variable.
app.listen(port, () => {
    console.log('De server luistert naar port ' + port);
});

module.exports = app;