import { expect } from 'chai'
import { User, UserHandler } from './user'

var uHandler: UserHandler
var db: any
var clientDb: any
var user : User

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
        uHandler = new UserHandler(db)
        done()
      })
    })

describe('#save user', function() {
  it('this will save a test user to the DB', function() {
    //creat the metric to save
    user = new User("inci90", "inci90@github.com", "password", false);
    uHandler.save(user, function(err: Error | null, result?: User[]) {
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.not.be.empty
    })
  })
})

describe('#get user', function() {
    it('this will fetch a user object from the DB', function() {
      //creat the metric to save
      uHandler.get("inci90", function(err: Error | null, result?: User) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#get user', function() {
    it('this will delete a user object from the DB', function() {
      //creat the metric to save
      uHandler.get("inci90", function(err: Error | null, result?: User) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })
  

/**
 * wipe all data created for tests
 */
after(function() {
    db.collection('users')
        .deleteMany({}, function(err : Error | null, result : any){
          if (err) throw err
          clientDb.close()
        })
  });
})
