import express = require('express');

const app = express();
const port: string = process.env.PORT || '8083';

const path = require('path');
app.use(express.static(path.join(__dirname, '/../public')));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

import { MetricsHandler } from './metrics'
app.get('/metrics', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result)
    })
});

app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end()
});

app.get(
    '/hello',
    (req: any, res: any) => {
        process.stdout.write("Hello");
        const name : string = req.query.name;
        res.status(200).render('hello.ejs', {name: name});
    }
);

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
});