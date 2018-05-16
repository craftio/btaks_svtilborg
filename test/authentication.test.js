/**
 * Testcases aimed at testing the authentication process.
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "Bruno",
                "lastname": "Gehard",
                "email": "brunogehard@avans.nl",
                "password": "sacha"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token').which.is.a('string');
                res.body.should.have.property('email').which.is.a('string');
                validToken = res.body.token;
            });
            module.exports = {
                token: validToken
            };
        // Tip: deze test levert een token op. Dat token gebruik je in
        // andere testcases voor beveiligde routes door het hier te exporteren
        // en in andere testcases te importeren via require.
        // validToken = res.body.token
        // module.exports = {
        //     token: validToken
        // }
        done();
    });

    it('should return an error on GET request', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/register')
            .end((err, res) => {
                res.should.have.status(404);
            });
        done();
    });

    it('should throw an error when the user already exists', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "bjorn",
                "lastname": "taks",
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                // No idea why an | Uncaught AssertionError: expected {} to have property 'token' | pops up here...
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when no firstname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "",
                "lastname": "taks",
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "b",
                "lastname": "taks",
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when no lastname is provided', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "bjorn",
                "lastname": "",
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "bjorn",
                "lastname": "t",
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when email is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/register')
            .send({
                "firstname": "bjorn",
                "lastname": "taks",
                "email": "btaks <btaks@avans.nl>",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

});

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('token').which.is.a('string');
                res.body.should.have.property('email').which.is.a('string');
                validToken = res.body.token;
            });
        done();
    });

    it('should throw an error when email does not exist', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "HeadhunterzIsNietDeBesteHardstyleDJDieErIs",
                "password": "secret"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when email exists but password is invalid', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "NoisecontrollersIsDeBesteProducer"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when using an invalid email', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks <btaks@avans.nl>",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });
});