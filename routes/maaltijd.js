const config = require('../config.json');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const dateTime = require("node-datetime");
const mysql = require('mysql');
const auth =  require('../auth/authentication');

app.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.post("/:huisId/maaltijd/", (req, res) => {
    let huisId = req.param.huisId;
});