import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import clientStart from './db'

var dbMet: MetricsHandler
var metric: Metric

describe('Metrics', () => {

  before(function() {
    //clear the db for tests
    clientStart(function(client: any) {
      client.db('mydb')
        .collection('documents')
        .deleteMany({},function(err:Error | null, result:any) {
        if (err) throw err
        client.close()
      })
    })
    dbMet = new MetricsHandler();

  })

  describe('#save', function() {
    it('this will save a metric', function() {
      //creat the metric to save
      metric = new Metric(new Date().getTime().toString(), 30);
      dbMet.save(metric, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  describe('#get', function() {
    it('test the single record get func by fetching saved metric', function() {
      dbMet.get(30, function(err: Error | null, result?: Metric[]) {
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
      dbMet.delete(30, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })

  //   it('test record was deleted', function() {
  //     dbMet.getAll(function(err: Error | null, result?: Metric[]) {
  //       expect(err).to.be.null
  //       expect(result).to.not.be.undefined
  //       expect(result).to.not.be.empty
  //     })
  //   })
  // })

  after(function() {
    //delete all records to clean up db
    clientStart(function(client: any) {
      client.db('mydb')
        .collection('documents')
        .deleteMany({},function(err:Error | null, result:any) {
        if (err) throw err
        client.close()
      })
    })
  });
}



)