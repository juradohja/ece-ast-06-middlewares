import { expect } from 'chai'
import { User, UserHandler } from './user'
import { MetricsHandler, Metric } from './metrics';

var uHandler: UserHandler
var db: any
var clientDb: any
var user1 : User
var user2 : User
var dbMet : MetricsHandler
var metric : Metric


//connect to DB
var mongoAsync = (callback: any) => {
  const MongoClient = require('mongodb').MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    callback(client)
  });
}

describe('Users', () => {

    before((done) =>  {
      mongoAsync((client: any) => {
        clientDb = client
        db = clientDb.db('mydb')
        dbMet = new MetricsHandler(db)
        uHandler = new UserHandler(db)
        user1 = new User("inci90", "inci90@github.com", "password1", false);
        user2 = new User("alberto", "alberto99@github.com", "password2", false);
        done()
      })
    })


describe('#save user', function() {
  it('this will save user1 to the DB', function() {
    //creat the metric to save
    uHandler.save(user1, function(err: Error | null, result?: User[]) {
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.not.be.empty
    })
  })
  it('this will save user2 to the DB', function() {
    //creat the metric to save
    uHandler.save(user2, function(err: Error | null, result?: User[]) {
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.not.be.empty
    })
  })
})

describe('#save metric', function() {
    it('this will save a metric', function() {
      //creat the metric to save
      metric = new Metric(new Date().getTime().toString(), 30, user1.getUsername());
      dbMet.save("inci90", metric, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
    it('this will save a metric', function() {
        //creat the metric to save
        metric = new Metric(new Date().getTime().toString(), 99, user1.getUsername());
        dbMet.save("alberto", metric, function(err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.not.be.empty
        })
      })
      it('this will save a metric', function() {
        //creat the metric to save
        metric = new Metric(new Date().getTime().toString(), 5, user2.getUsername());
        dbMet.save("inci90", metric, function(err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.not.be.empty
        })
      })
      it('this will save a metric', function() {
        //creat the metric to save
        metric = new Metric(new Date().getTime().toString(), 15, user2.getUsername());
        dbMet.save("alberto", metric, function(err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          expect(result).to.not.be.empty
        })
      })
  })

/**
 * close connection
 */
after(function() {

          clientDb.close()
  });
})

