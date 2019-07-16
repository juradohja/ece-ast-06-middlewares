import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import clientStart from './db'

var dbMet: MetricsHandler

describe('Metrics', () => {

  before(function() {
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
    it('this will save some data', function() {
      let metric = new Metric(new Date().getTime().toString(), 10);
      dbMet.save(metric, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })

    it('this will update existing data', function() {
      dbMet.get({value : 0}, function(err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })
}

)