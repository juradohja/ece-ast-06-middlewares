import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import clientStart from './db'

var dbMet: MetricsHandler

describe('Metrics', function() {
  before(function() {
    clientStart(function(client: any) {
      client.db('mydb')
        .collection('documents')
        .deleteMany({},function(err:Error | null, result:any) {
        if (err) throw err
        client.close()
      })
    })

    dbMet = new MetricsHandler()
  })
})