export class Metric {

    public timestamp: string
    public value: number

    constructor(ts: string, v: number) {
        this.timestamp = ts
        this.value = v
    }
}

export class MetricsHandler {

    private db: any;

    constructor(db) {
        this.db = db
    }

    public delete(value: any, callback: (err: Error | null, result?: any) => void) {
        
            const collection = this.db.collection('documents');
            // Find some documents
            collection.deleteOne({"value" : value}, function (err: any, result: any) {
                if (err){
                    return callback(err, result);
                }
            console.log("doc deleted");
            callback(err, result);
        })

    }

    public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
        
            const collection = this.db.collection('documents')
            // Insert some document
            collection.insertOne(metric, function (err: any, result: any) {
                if (err) return callback(err, result)
                console.log("Document inserted into the collection")
                callback(err, result)
            });
    }

    //maybe not static
    public getAll(callback: (error: Error | null, result?: any) => void) {

            const collection = this.db.collection('documents');
            // Find some documents
            collection.find({}).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                callback(err, docs);
            });



    }



    public get(value: any, callback: (error: Error | null, result?: any) => void) {


            const collection = this.db.collection('documents');
            // Find some documents
            collection.find({ "value": value }).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                callback(err, docs);
            });



    }

}