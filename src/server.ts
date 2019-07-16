import express = require('express');
import bodyparser = require('body-parser');
import passport = require('passport');
import { MetricsHandler, Metric } from './metrics';
import { User, UserHandler } from './user';

const Strategy = require('passport-local').Strategy;

var db: any;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    db = client.db('mydb')
    // Start the application after the database connection is ready
    const port: string = process.env.PORT || '8085'
    app.listen(port, (err: Error) => {
        if (err) {
            throw err
        }
        console.log(`server is listening on port ${port}`)
    })
});

passport.use(new Strategy(
    function(username, password, done) {
        new UserHandler(db).get(username, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));



// Initialize connection once



//import morgan module for logging
var morgan = require('morgan');

const app = express();
const port: string = process.env.PORT || '8083';

//log all request in the Apache combined format to STDOU
app.use(morgan('combined'))

const path = require('path');
app.use(express.static(path.join(__dirname, '/../public')));

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.use(passport.initialize());
app.use(passport.session());




app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');



app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end()
});

app.get('/login', (req: any, res: any) => {
    //render login page
    res.end()
});

app.post('/login',
    passport.authenticate('local', { failureRedirect : '/login'}),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout',
    function(req: any, res : any){
        req.logout();
        res.redirect('/');
    })

app.get('/metrics', (req: any, res: any) => {
  if(req.query.value){
    console.log("new GET single record request");

    const value: number = parseInt(req.query.value);

    new MetricsHandler(db).get(value, (err: Error | null, result?: any) => {
      if (err) {
          throw err
      }
      res.json(result)
  })


  }else{
  console.log("new GET all records request");
    new MetricsHandler(db).getAll((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result)
    })
  }//end else
});

app.get(
    '/hello',
    (req: any, res: any) => {
        process.stdout.write("Hello");
        const name : string = req.query.name;
        res.status(200).render('hello.ejs', {name: name});
    }
);

//POST


app.post('/metrics', (req: any, res: any) => {
    if(req.body.value){
        console.log("post request recieved");
      const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.value));
      new MetricsHandler(db).save(metric, (err: any, result: any) => {
        if (err)
          return res.status(500).json({error: err, result: result});
        res.status(201).json({error: err, result: true})
      })
    }else{
      return res.status(400).json({error: 'Wrong request parameter',});
    }
  })

app.delete('/metrics', (req: any, res: any) => {

  console.log("delete request recieved");
  new MetricsHandler(db).delete(req.body.value, (err: any, result: any) => {
    if (err)
      return res.status(500).json({error: err, result: result});
    res.status(201).json({error: err, result: true})
  })

})
