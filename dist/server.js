"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var metrics_1 = require("./metrics");
var app = express();
var port = process.env.PORT || '8083';
var path = require('path');
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.get('/metrics', function (req, res) {
    if (req.query.value) {
        console.log("new GET single record request");
        var value = parseInt(req.query.value);
        new metrics_1.MetricsHandler().get(value, function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    }
    else {
        console.log("new GET all records request");
        new metrics_1.MetricsHandler().getAll(function (err, result) {
            if (err) {
                throw err;
            }
            res.json(result);
        });
    } //end else
});
app.get('/', function (req, res) {
    res.write('Hello world');
    res.end();
});
app.get('/hello', function (req, res) {
    process.stdout.write("Hello");
    var name = req.query.name;
    res.status(200).render('index.ejs', { name: name });
});
//POST
app.post('/metrics', function (req, res) {
    if (req.body.value) {
        console.log("post request recieved");
        var metric = new metrics_1.Metric(new Date().getTime().toString(), parseInt(req.body.value));
        new metrics_1.MetricsHandler().save(metric, function (err, result) {
            if (err)
                return res.status(500).json({ error: err, result: result });
            res.status(201).json({ error: err, result: true });
        });
    }
    else {
        return res.status(400).json({ error: 'Wrong request parameter', });
    }
});
app.delete('/metrics', function (req, res) {
    console.log("delete request recieved");
    new metrics_1.MetricsHandler().delete(req.body.value, function (err, result) {
        if (err)
            return res.status(500).json({ error: err, result: result });
        res.status(201).json({ error: err, result: true });
    });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
