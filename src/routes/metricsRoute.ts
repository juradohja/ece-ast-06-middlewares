import express = require('express');
import {Metric, MetricsHandler} from "../metrics";

module.exports = function(db) {
    const metricsRouter = express.Router();

    metricsRouter.get('/metrics', (req: any, res: any) => {
        if(req.session.loggedIn) {
            if (req.query.username) {
                console.log("new GET single record request");

                //const username: string = req.body.username;

                // new MetricsHandler(db).get(req.body.username, req.body.value, (err: Error | null, result?: any) => {
                new MetricsHandler(db).getUserMetrics(req.query.username, (err: Error | null, result?: any) => {
                    if (err) {
                        throw err
                    }
                    console.log("printing record");
                    console.log(result[0].metrics);
                    res.json(result[0].metrics)
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
        } else {
            res.status(401).send("Unauthorized access");
        }
    });

    metricsRouter.post('/metrics', (req: any, res: any) => {
        if(req.session.loggedIn) {
            if (req.body.value) {
                console.log("post request recieved");
                const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value), req.body.username);
                new MetricsHandler(db).save(req.body.username, metric, (err: any, result: any) => {
                    if (err)
                        return res.status(500).json({error: err, result: result});
                    res.status(201).redirect('/');
                })
            } else {
                return res.status(400).json({error: 'Wrong request parameter',});
            }
        } else {
            res.status(401).send("Unauthorized access");
        }
    });

    metricsRouter.delete('/metrics', (req: any, res: any) => {
        if(req.session.loggedIn) {
            console.log("delete request recieved");
            console.log(req.body.username);
            new MetricsHandler(db).delete(req.body.username, (err: any, result: any) => {
                if (err)
                    return res.status(500).json({error: err, result: result});
                res.status(201).redirect('/');
            })
        } else {
            res.status(401).send("Unauthorized access");
        }
    });

    return metricsRouter;
}