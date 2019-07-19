import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { User, UserHandler } from './user';
import { callbackify } from 'util';

var dbMet: MetricsHandler
var db: any
var clientDb: any
var metric: Metric
var user: User
var uHandler: UserHandler

/**
 * Database connection code
 * @param callback 
 */
var mongoAsync = (callback: any) => {
  const MongoClient = require('mongodb').MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if (err) throw err
    callback(client)
  });
}

/**
 * This tests the metrics handling functions by creating a user
 * then creating metrics and saving, fetching and deleting the metric
 * for that user
 */
describe('Metrics', () => {

  before((done) => {
    mongoAsync((client: any) => {
      clientDb = client
      db = clientDb.db('mydb')
      dbMet = new MetricsHandler(db)
      user = new User("testUser", "test@test.com", "password", false)
      uHandler = new UserHandler(db)
      //save the test-user
      uHandler.save(user, function (err: Error | null, result?: User[]) {
        expect(err).to.be.null
      })

      done()
    })
  })

  describe('#save metric', function () {
    it('this will save a metric', function () {
      //creat the metric to save
      metric = new Metric(new Date().getTime().toString(), 30, user.getUsername());
      dbMet.save("testUser", metric, function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#getUserMetrics', function () {
    it('test the single record get func by fetching saved metric', function () {
      dbMet.getUserMetrics("testUser", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#delete', function () {
    it('this will delete the metric', function () {
      //creat the metric to save
      dbMet.delete("testUser", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })

  })

  /**
   * close the connection
   */
  after(function () {
    db.collection('users')
      .deleteMany({}, function (err: Error | null, result: any) {
        if (err) throw err
        clientDb.close()
      })
  });
}
)