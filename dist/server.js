"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
var port = process.env.PORT || '8083';
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
var metrics_1 = require("./metrics");
app.get('/metrics', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/', function (req, res) {
    res.write('Hello world');
    res.end();
});
app.get('/hello', function (req, res) {
    process.stdout.write("Hello");
    var name = req.query.name;
    res.status(200).render('hello.ejs', { name: name });
});
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
