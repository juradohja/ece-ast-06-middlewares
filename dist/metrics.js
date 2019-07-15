"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler() {
        this.clientStart = db_1.default;
    }
    MetricsHandler.prototype.delete = function (value, callback) {
        this.clientStart(function (client) {
            var db = client.db('mydb');
            var collection = db.collection('documents');
            // Find some documents
            collection.deleteOne(value, function (err, result) {
                if (err) {
                    return callback(err, result);
                }
                client.close(); // Close the connection
                console.log("doc deleted");
                callback(err, result);
            });
        });
    };
    MetricsHandler.prototype.save = function (metric, callback) {
        this.clientStart(function (client) {
            var db = client.db('mydb');
            var collection = db.collection('documents');
            // Insert some document
            collection.insertOne(metric, function (err, result) {
                if (err)
                    return callback(err, result);
                console.log("Document inserted into the collection");
                client.close(); // Close the connection
                callback(err, result);
            });
        });
    };
    //maybe not static
    MetricsHandler.prototype.getAll = function (callback) {
        this.clientStart(function (client) {
            var db = client.db('mydb');
            var collection = db.collection('documents');
            // Find some documents
            collection.find({}).toArray(function (err, docs) {
                if (err)
                    return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                client.close(); // Close the connection
                callback(err, docs);
            });
        });
    };
    MetricsHandler.prototype.get = function (value, callback) {
        this.clientStart(function (client) {
            var db = client.db('mydb');
            var collection = db.collection('documents');
            // Find some documents
            collection.find({ "value": value }).toArray(function (err, docs) {
                if (err)
                    return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                client.close(); // Close the connection
                callback(err, docs);
            });
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
