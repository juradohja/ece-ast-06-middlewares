import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { User } from './user';

var dbMet: MetricsHandler
var db: any
var clientDb: any
var metric : Metric
var user : User

var mongoAsync = (callback: any) => {
  const MongoClient = require('mongodb').MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    callback(client)
  });
}

describe('Metrics', () => {

      before((done) =>  {
        mongoAsync((client: any) => {
          clientDb = client
          db = clientDb.db('mydb')
          dbMet = new MetricsHandler(db)
          user= new User("testUser", "test@test.com", "password", false)
          done()
        })
      })

  describe('#save', function() {
    it('this will save a metric', function() {
      //creat the metric to save
      metric = new Metric(new Date().getTime().toString(), 30, user.getUsername());
      dbMet.save("inci90", metric, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#get', function() {
    it('test the single record get func by fetching saved metric', function() {
      dbMet.getUserMetrics("testUser", function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })

    it('test the getAll func', function() {
      dbMet.getAll(function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#delete', function() {
    it('this will delete a metric', function() {
      //creat the metric to save
      dbMet.delete("inci", function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  
    it('test record was deleted', function() {
      dbMet.getUserMetrics("testuser", function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })

  after(function() {
    db.collection('documents')
        .deleteMany({}, function(err : Error | null, result : any){
          if (err) throw err
          clientDb.close()
        })
  });
}



)