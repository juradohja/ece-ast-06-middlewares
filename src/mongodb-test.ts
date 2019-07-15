import mongodb from 'mongodb'
const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url: string = 'mongodb://localhost:27017';
// Database Name
const dbName: string = 'mydb';

//declare interface for Metric object
interface Metric {
  timestamp: string;
  value: number;
}

const insertManyDocuments = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  const metrics: Metric[] = [
    { timestamp: new Date().getTime().toString(), value: 11},
    { timestamp: new Date().getTime().toString(), value: 88},
    { timestamp: new Date().getTime().toString(), value: 22},
  ]
  collection.insertMany(
    metrics,
    function(err: any, result: any) {
      if(err)
        throw err
      console.log("Document inserted into the collection");
      callback(result);
    });
  }
    
const insertDocument = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some document
  const metric: Metric = {
    timestamp: new Date().getTime().toString(),
     value: 22
   }
  collection.insertOne(
    metric,
    function(err: any, result: any) {
      if(err)
        throw err
      console.log("Document inserted into the collection");
      callback(result);
  });
}

const findDocuments = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({ value : 99 }).toArray(function(err: any, docs: object) {
    if(err)
      throw err
    console.log("Found the following documents");
    console.log(docs)
    callback(docs);
  });
}

//create the connection
// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });
// Use connect method to connect to the Server
client.connect(function(err) {
  if(err){
    throw err
  }
  console.log("Connected successfully to server");
  const db = client.db(dbName);

  insertDocument(db, function() {
    findDocuments(db, function() {
      client.close();
    });
  });
   

});