import { User, UserHandler } from "./user";

export class Metric {

    public timestamp: string;
    public value: number;
    public username: string;

    constructor(ts: string, v: number, u: string) {
        this.timestamp = ts;
        this.value = v;
        this.username = u;
    }
}

export class MetricsHandler {

    private db: any;

    constructor(db) {
        this.db = db
    }

    public delete(username: string, value: any, callback: (err: Error | null, result?: any) => void) {
        
            const collection = this.db.collection('users');
            // Find some documents
            collection.updateOne( {"username" : username}, {$pull: { metric: {"value": value}}}, function (err: any, result: any) {
                if (err){
                    return callback(err, result);
                }
            console.log("doc deleted");
            callback(err, result);
        })

    }

    public save(username: string, metric: Metric, callback: (err: Error | null, result?: any) => void) {
        
            const collection = this.db.collection('users')

            //locate a user from the database and append a metric to that user entry
            collection.updateOne( {"username" : username}, {$push: {"metrics": metric}}, function (err: any, result: any) {
                if (err) return callback(err, result);
                console.log("Document inserted into the collection");
                callback(err, result)
            });
    }

    public getAll(callback: (error: Error | null, result?: any) => void) {

            const collection = this.db.collection('users');
            // Find some documents
            collection.find({}).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                callback(err, docs);
            });

    }

    public get(username: string, value: any, callback: (error: Error | null, result?: any) => void) {
            const collection = this.db.collection('users');
            // Find some documents
            collection.find({ "username": username, "metrics": { $elemMatch : {$filter : {"value": value}}}}, ).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                callback(err, docs);
            });
    }

    public getUserMetrics(username: string, callback: (error: Error | null, result?: any) => void) {
        const collection = this.db.collection('users');
        collection.find({username : username}, {metrics:1, _id:0}).toArray(function (err : any, docs: object) {
            if (err) return callback(err, docs);
            console.log(docs);
            callback(err, docs);
        })
    }

}