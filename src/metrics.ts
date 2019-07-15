import clientStart from './db'
export class Metric {

    public timestamp: string
    public value: number

    constructor(ts: string, v: number) {
        this.timestamp = ts
        this.value = v
    }
}

export class MetricsHandler {

    private clientStart: any

    constructor() {
        this.clientStart = clientStart
    }

    public delete(value: number, callback: (err: Error | null, result?: any) => void) {
        
        this.clientStart(function (client: any) {

            const db = client.db('mydb')

            const collection = db.collection('documents');
            // Find some documents
            collection.deleteOne(value, function (err: any, result: any) {
                if (err){
                    return callback(err, result);
                }
                client.close(); // Close the connection
            console.log("doc deleted");
            callback(err, result);
        })
    })

    }

    public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
        this.clientStart(function (client: any) {
            const db = client.db('mydb')
            const collection = db.collection('documents')
            // Insert some document
            collection.insertOne(metric, function (err: any, result: any) {
                if (err) return callback(err, result)
                console.log("Document inserted into the collection")
                client.close() // Close the connection
                callback(err, result)
            });
        })
    }

    //maybe not static
    public getAll(callback: (error: Error | null, result?: any) => void) {

        this.clientStart(function (client: any) {

            const db = client.db('mydb')

            const collection = db.collection('documents');
            // Find some documents
            collection.find({}).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                client.close() // Close the connection
                callback(err, docs);
            });


        })

    }



    public get(value: any, callback: (error: Error | null, result?: any) => void) {

        this.clientStart(function (client: any) {

            const db = client.db('mydb')

            const collection = db.collection('documents');
            // Find some documents
            collection.find({ "value": value }).toArray(function (err: any, docs: object) {
                if (err) return callback(err, docs);
                console.log("Found the following documents");
                console.log(docs);
                client.close() // Close the connection
                callback(err, docs);
            });


        })

    }

}