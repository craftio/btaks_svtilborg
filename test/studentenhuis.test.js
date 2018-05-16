/**
 * Testcases aimed at testing the studentenhuis operations.
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Studentenhuis API POST', () => {
    let validToken = null;
    let invalidToken = 0;
    before(() => {
        chai.request(server)
            .post('api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                validToken = res.body.token
            });
    });
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/studentenhuis')
            .set('X-Access-Token', invalidToken)
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                res.should.have.status(401);
            });
        done();
    });

    it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/studentenhuis')
            .set('X-Access-Token', validToken)
            .send({
                "naam": "Breda de gekste",
                "adres": "Breda"
            })
            .end((err, res) => {
                res.should.have.status(200);
            });
        done();
    });

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/studentenhuis')
            .set('X-Access-Token', validToken)
            .send({
                "adres": "Breda"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .post('/api/studentenhuis')
            .set('X-Access-Token', validToken)
            .send({
                "naam": "Breda de gekste"
            })
            .end((err, res) => {
                res.should.have.status(412);
            });
        done();
    });
});

describe('Studentenhuis API GET all', () => {
    let validToken = null;
    let invalidToken = 0;
    before(() => {
        chai.request(server)
        .post('/api/login')
        .send({
            "email": "btaks@avans.nl",
            "password": "btaks"
        })
        .end((err, res) => {
            validToken = res.body.token;
        });
    });
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/studentenhuis')
            .set('X-Access-Token', invalidToken)
            .end((err, res) => {
                res.should.have.status(401);
            });
        done();
    });

    it('should return all studentenhuizen when using a valid token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/studentenhuis')
            .set('X-Access-Token', validToken)
            .end((err, res) => {
                res.should.have.status(200);
            });
        done();
    });
});

describe('Studentenhuis API GET one', () => {
    let validToken = null;
    let invalidToken = 0;
    before(() => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                validToken = res.body.token;
            });
    });
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('X-Access-Token', invalidToken)
            .end((err, res) => {
                res.should.have.status(401);
            });
        done();
    });

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('X-Access-Token', validToken)
            .end((err, res) => {
                res.should.have.status(200);
            });
        done();
    });

    it('should return an error when using an non-existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .get('/api/studentenhuis/9999')
            .set('X-Access-Token', validToken)
            .end((err, res) => {
                res.should.have.status(404);
            });
        done();
    });
});

describe('Studentenhuis API PUT', () => {
    let validToken = null;
    let invalidToken = 0;
    before(() => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                validToken = res.body.token;
            });
    });
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('X-Access-Token', invalidToken)
            .send({
                "naam": "Lovensdijk",
                "adres": "Lovensdijkstraat, Breda"
            })
            .end((err, res) => {
                res.should.have.status(401);
            });
        done();
    });

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('X-Access-Token', invalidToken)
            .send({
                "naam": "Lovensdijk",
                "adres": "Lovensdijkstraat, Breda"
            })
            .end((err, res) => {
                res.should.have.status(200);
            });
        done();
    });

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('X-Access-Token', invalidToken)
            .send({
                "adres": "Lovensdijkstraat, Breda"
            })
            .end((err, res) => {
                res.should.have.status(404);
            });
        done();
    });

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('X-Access-Token', invalidToken)
            .send({
                "adres": "Lovensdijkstraat, Breda"
            })
            .end((err, res) => {
                res.should.have.status(404);
            });
        done();
    });
});

describe('Studentenhuis API DELETE', () => {
    let validToken = null;
    let invalidToken = 0;
    before(() => {
        chai.request(server)
            .post('/api/login')
            .send({
                "email": "btaks@avans.nl",
                "password": "btaks"
            })
            .end((err, res) => {
                validToken = res.body.token;
            });
    });

    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        chai.request(server)
            .del('/api/studentenhuis/97')
            .set('X-Access-Token', invalidToken)
            .end((err, res) => {
                res.should.have.status(401);
            });
        done();
    });
});