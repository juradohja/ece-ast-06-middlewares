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

    public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
        this.clientStart(function(client: any){
          const db = client.db('mydb')
          const collection = db.collection('documents')
          // Insert some document
          collection.insertOne( metric, function(err: any, result: any) {
            if(err) return callback(err, result)
            console.log("Document inserted into the collection")
            client.close() // Close the connection
            callback(err, result)
          });
        })
      }
    
    //maybe not static
    static get(callback: (error: Error | null, result?: Metric[]) => void) {
        const result = [
            new Metric('2013-11-04 14:00 UTC', 12),
            new Metric('2013-11-04 14:30 UTC', 15)
        ]
        callback(null, result)
    }

}