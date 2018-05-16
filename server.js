const express       = require('express')
const bodyParser    = require('body-parser')
const config        = require('./config.json');

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
    res.send('To view any information, add /api/register at the end of the link and do a POST request with first name\n' +
        'last name, email (has to be unique per account) and password for login.\n' +
        'Then change register to login in the url and do a POST request with email and password to get your API key.\n\n' +
        'Using your API key in the header, you can then start CRUD operations via POST, GET, PUT and DELETE requests.\n' +
        'It is advisable to use Postman for these operations, you can find Postman here: https://www.getpostman.com/ ');
})

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