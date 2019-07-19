import { User, UserHandler } from "./user";

/**
 * Metric class contains data that a user can create/store/delete
 */
export class Metric {

    public timestamp: string;
    public value: number;
    public username: string;

    constructor(ts: string, v: number, u: string) {
        this.timestamp = ts;
        this.value = v;
        //username is deprecated and should be removed
        //metrichandler functions will also need to be modified
        this.username = u;
    }
}

/**
 * MetricsHandler class contains functions for deleting/saving/fetching metrics from db
 */
export class MetricsHandler {

    private db: any;

    constructor(db) {
        this.db = db
    }

    /**
     * Delete a metric from DB for a user
     * @param un username of the metric owner
     * @param callback 
     */
    public delete(un: string, callback: (err: Error | null, result?: any) => void) {
        const collection = this.db.collection('users');
        // Find some documents
        collection.updateOne({ username: un }, { $pop: { "metrics": 1 } }, function (err: any, result: any) {
            if (err) {
                return callback(err, result);
            }
            console.log("doc deleted");
            callback(err, result);
        })
    }

    /**
     * Save a metric to the DB
     * @param username user that will own the metric
     * @param metric metric to be saved
     * @param callback sucess/error callback returns metric inserted
     */
    public save(username: string, metric: Metric, callback: (err: Error | null, result?: any) => void) {
        const collection = this.db.collection('users')
        //locate a user from the database and append a metric to that user entry
        collection.updateOne({ "username": username }, { $push: { "metrics": metric } }, function (err: any, result: any) {
            if (err) return callback(err, result);
            console.log("Document inserted into the collection");
            callback(err, result)
        });
    }

    /**
     * Fetch metrics from the database
     * @param username user to fetch metrics for
     * @param callback json doc of results
     */
    public getUserMetrics(username: string, callback: (error: Error | null, result?: any) => void) {
        const collection = this.db.collection('users');
        collection.find({ username: username }, { metrics: 1, _id: 0 }).toArray(function (err: any, docs: object) {
            if (err) return callback(err, docs);
            console.log(docs);
            callback(err, docs);
        })
    }

}