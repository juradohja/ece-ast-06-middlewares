import express = require('express');
import {Metric, MetricsHandler} from "../metrics";

module.exports = function(db) {
    const metricsRouter = express.Router();

    metricsRouter.get('/metrics', (req: any, res: any) => {
        if(req.session.loggedIn) {
            if (req.query.username) {
                // Single User Get Request
                new MetricsHandler(db).getUserMetrics(req.query.username, (err: Error | null, result?: any) => {
                    if (err) {
                        throw err
                    }
                    res.json(result[0].metrics)
                })
            }
        } else {
            res.status(401).send("Unauthorized access");
        }
    });

    metricsRouter.post('/metrics', (req: any, res: any) => {
        if(req.session.loggedIn) {
            if (req.body.value) {
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
            new MetricsHandler(db).delete(req.body.username, (err: any, result: any) => {
                if (err)
                    return res.status(500).json({error: err, result: result});
                res.status(201).redirect('/logout');
            })
        } else {
            res.status(401).send("Unauthorized access");
        }
    });

    return metricsRouter;
}