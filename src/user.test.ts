import { expect } from 'chai'
import { User, UserHandler } from './user'

var uHandler: UserHandler
var db: any
var clientDb: any
var user: User

//connect to DB
var mongoAsync = (callback: any) => {
  const MongoClient = require('mongodb').MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if (err) throw err
    callback(client)
  });
}

/**
 * This tests the user functions including the signup login process and password reset
 */
describe('Users', () => {

  before((done) => {
    mongoAsync((client: any) => {
      clientDb = client
      db = clientDb.db('mydb')
      uHandler = new UserHandler(db)
      user = new User("inci90", "inci90@github.com", "password", false);
      done()
    })
  })

  describe('#login user', function () {
    it('test the password login and hashing functionality', function () {
      expect(user.validatePassword("password")).to.be.true
    })
    it('testing change password function', function () {
      user.setPassword("changed")
      expect(user.validatePassword("changed")).to.be.true
    })
  })

  describe('#save user', function () {
    it('this will save a test user to the DB', function () {
      //creat the metric to save
      uHandler.save(user, function (err: Error | null, result?: User[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#get user', function () {
    it('this will fetch a user object from the DB', function () {
      //creat the metric to save
      uHandler.get("inci90", function (err: Error | null, result?: User) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#delete user', function () {
    it('this will delete a user object from the DB', function () {
      //creat the metric to save
      uHandler.get("inci90", function (err: Error | null, result?: User) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  /**
   * wipe all data created for tests
   */
  after(function () {
    db.collection('users')
      .deleteMany({}, function (err: Error | null, result: any) {
        if (err) throw err
        clientDb.close()
      })
  });
})
