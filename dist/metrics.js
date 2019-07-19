"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Metric class contains data that a user can create/store/delete
 */
var Metric = /** @class */ (function () {
    function Metric(ts, v, u) {
        this.timestamp = ts;
        this.value = v;
        //username is deprecated and should be removed
        //metrichandler functions will also need to be modified
        this.username = u;
    }
    return Metric;
}());
exports.Metric = Metric;
/**
 * MetricsHandler class contains functions for deleting/saving/fetching metrics from db
 */
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(db) {
        this.db = db;
    }
    /**
     * Delete a metric from DB for a user
     * @param un username of the metric owner
     * @param callback
     */
    MetricsHandler.prototype.delete = function (un, callback) {
        var collection = this.db.collection('users');
        // Find some documents
        collection.updateOne({ username: un }, { $pop: { "metrics": 1 } }, function (err, result) {
            if (err) {
                return callback(err, result);
            }
            console.log("doc deleted");
            callback(err, result);
        });
    };
    /**
     * Save a metric to the DB
     * @param username user that will own the metric
     * @param metric metric to be saved
     * @param callback sucess/error callback returns metric inserted
     */
    MetricsHandler.prototype.save = function (username, metric, callback) {
        var collection = this.db.collection('users');
        //locate a user from the database and append a metric to that user entry
        collection.updateOne({ "username": username }, { $push: { "metrics": metric } }, function (err, result) {
            if (err)
                return callback(err, result);
            console.log("Document inserted into the collection");
            callback(err, result);
        });
    };
    /**
     * Fetch metrics from the database
     * @param username user to fetch metrics for
     * @param callback json doc of results
     */
    MetricsHandler.prototype.getUserMetrics = function (username, callback) {
        var collection = this.db.collection('users');
        collection.find({ username: username }, { metrics: 1, _id: 0 }).toArray(function (err, docs) {
            if (err)
                return callback(err, docs);
            console.log(docs);
            callback(err, docs);
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
