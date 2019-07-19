import express = require('express');
import bodyparser = require('body-parser');
import session = require('express-session');
import ConnectMongo = require('connect-mongo');
import {UserHandler} from './user';


let db: any;
let dbUser: any;

let authRouter : any;
let userRouter : any;
let metricsRouter : any;

const crypto = require('crypto');
const morgan = require('morgan');
const mongodb = require('mongodb');
const MongoStore = ConnectMongo(session);
const MongoClient = mongodb.MongoClient; // Create a new MongoClient
// const Strategy = require('passport-local').Strategy;

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (err: any, client: any) => {
    if (err) throw err;
    db = client.db('mydb');
    dbUser = new UserHandler(db);

    authRouter = require('./routes/authRoute')(dbUser);
    userRouter = require('./routes/userRoute')(db, dbUser);
    metricsRouter = require('./routes/metricsRoute')(db);

    app.use(authRouter);
    app.use(userRouter);
    app.use(metricsRouter);
    // Start the application after the database connection is ready
    const port: string = process.env.PORT || '8086';
    app.listen(port, (err: Error) => {
        if (err) {
            throw err
        }
        console.log(`server is listening on port ${port}`)
    })
});

const app = express();
const path = require('path');

//log all request in the Apache combined format to STDOU
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(session({
    secret: 'user session',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({url: 'mongodb://localhost/mydb'})
}));

// app.use(passport.initialize());
// app.use(passport.session());

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
};

// Home Route
app.get('/', authCheck, (req: any, res: any) => {
    res.render('index.ejs', {
        username: req.session.userRoute.username,
        email: req.session.userRoute.email
    })
});

app.get('/hello', (req: any, res: any) => {
        process.stdout.write("Hello");
        const name: string = req.query.name;
        res.status(200).render('index.ejs', {name: name});
    }
);



