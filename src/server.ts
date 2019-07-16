import express = require('express');
import bodyparser = require('body-parser');
import { MetricsHandler, Metric } from './metrics';
import session = require('express-session')
import ConnectMongo = require('connect-mongo')
const MongoStore = ConnectMongo(session)
import { User, UserHandler } from './user';
const authRouter = express.Router()
const userRouter = express.Router()

// const Strategy = require('passport-local').Strategy;

var db: any;
var dbUser : any;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient; // Create a new MongoClient
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    db = client.db('mydb')
    dbUser = new UserHandler(db)
    // Start the application after the database connection is ready
    const port: string = process.env.PORT || '8085'
    app.listen(port, (err: Error) => {
        if (err) {
            throw err
        }
        console.log(`server is listening on port ${port}`)
    })
});

// passport.use(new Strategy(
//     function(username, password, done) {
//         new UserHandler(db).get(username, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             if (!user.verifyPassword(password)) { return done(null, false); }
//             return done(null, user);
//         });
//     }
// ));



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

app.use(session({
    secret: 'user session',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: 'mongodb://localhost/mydb' })
}))

// app.use(passport.initialize());
// app.use(passport.session());




app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');



app.get('/', (req: any, res: any) => {
    res.write('Hello world');
    res.end()
});

authRouter.get('/login', function (req: any, res: any) {
    res.render('login')
})

authRouter.get('/signup', function (req: any, res: any) {
    res.render('signup')
})

authRouter.get('/logout', function (req: any, res: any) {
    if (req.session.loggedIn) {
        delete req.session.loggedIn
        delete req.session.user
    }
    res.redirect('/login')
})

authRouter.post('/login', function (req: any, res: any, next: any) {
    dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
        if (err) next(err)
        if (result === null || !result.validatePassword(req.body.password)) {
            console.log('login')
            res.redirect('/login')
        } else {
            req.session.loggedIn = true
            req.session.user = result
            res.redirect('/')
        }
    })
})

userRouter.post('/', function (req: any, res: any, next: any) {
    dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
        if (err) next(err)
        if (result) {
            res.status(409).send("user already exists")
        } else {
            dbUser.save(req.body, function (err: Error | null) {
                if (err) next(err)
                else res.status(201).send("user persisted")
            })
        }
    })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    })
})

app.use(authRouter)
app.use(userRouter)

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
    res.render('index.ejs', {name: req.params.name})
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

app.get(    '/hello',    (req: any, res: any) => {
        process.stdout.write("Hello");
        const name : string = req.query.name;
        res.status(200).render('index.ejs', {name: name});
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
