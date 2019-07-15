import mongodb from 'mongodb'
const mongodb = require('mongodb');

const url: string = 'mongodb://localhost:27017' 
export default function clientStart (callback:(client:any) => void) {

  const MongoClient = mongodb.MongoClient
  const client = new MongoClient(url, { useNewUrlParser: true })

  // Use connect method to connect to the Server
  client.connect(function(err) {
    if(err)
      throw err
    console.log("Connected successfully to server")
    callback(client)
  });
}