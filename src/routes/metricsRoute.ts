import express = require('express');
import {Metric, MetricsHandler} from "../metrics";

module.exports = function(db) {
    const metricsRouter = express.Router();

    metricsRouter.get('/metrics', (req: any, res: any) => {

        if (req.body.username && req.body.value) {
            console.log("new GET single record request");

            //const username: string = req.body.username;

            new MetricsHandler(db).get(req.body.username, req.body.value, (err: Error | null, result?: any) => {
                if (err) {
                    throw err
                }
                console.log("printing record");
                res.json(result)
            })
        } else {
            console.log("new GET all records request");
            new MetricsHandler(db).getAll((err: Error | null, result?: any) => {
                if (err) {
                    throw err
                }
                res.json(result)
            })
        }//end else
    });

    metricsRouter.post('/metrics', (req: any, res: any) => {
        if (req.body.value) {
            console.log("post request recieved");
            const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value), req.body.username);
            new MetricsHandler(db).save(req.body.username, metric, (err: any, result: any) => {
                if (err)
                    return res.status(500).json({error: err, result: result});
                res.status(201).json({error: err, result: true})
            })
        } else {
            return res.status(400).json({error: 'Wrong request parameter',});
        }
    });

    metricsRouter.delete('/metrics', (req: any, res: any) => {
        console.log("delete request recieved");
        new MetricsHandler(db).delete(req.body.username, req.body.value, (err: any, result: any) => {
            if (err)
                return res.status(500).json({error: err, result: result});
            res.status(201).json({error: err, result: true})
        })
    });

    return metricsRouter;
}