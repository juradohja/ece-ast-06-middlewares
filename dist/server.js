"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyparser = require("body-parser");
var session = require("express-session");
var ConnectMongo = require("connect-mongo");
var user_1 = require("./user");
var db;
var dbUser;
var authRouter;
var userRouter;
var metricsRouter;
//import modules for encryption, logging and database 
var crypto = require('crypto');
var morgan = require('morgan');
var mongodb = require('mongodb');
var MongoStore = ConnectMongo(session);
var MongoClient = mongodb.MongoClient; // Create a new MongoClient
/**
 * Initital connection to the database
 */
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, client) {
    if (err)
        throw err;
    //define document collection and init the user handler for login/signup
    db = client.db('mydb');
    dbUser = new user_1.UserHandler(db);
    //routes for login, user creation and handling of metrics
    authRouter = require('./routes/authRoute')(dbUser);
    userRouter = require('./routes/userRoute')(db, dbUser);
    metricsRouter = require('./routes/metricsRoute')(db);
    app.use(authRouter);
    app.use(userRouter);
    app.use(metricsRouter);
    // Start the application after the database connection is ready
    var port = process.env.PORT || '8086';
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }
        console.log("server is listening on port " + port);
    });
});
var app = express();
var path = require('path');
//log all request in the Apache combined format to STDOU
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
//store session data
app.use(session({
    secret: 'user session',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: 'mongodb://localhost/mydb' })
}));
//setup rendering of ejs views
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
//check if user logged in or otherwise redirect to login page
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
// Home Route, calls authCheck
app.get('/', authCheck, function (req, res) {
    res.render('index.ejs', {
        username: req.session.userRoute.username,
        email: req.session.userRoute.email
    });
});
//deprecated route, should be removed
app.get('/hello', function (req, res) {
    process.stdout.write("Hello");
    var name = req.query.name;
    res.status(200).render('index.ejs', { name: name });
});
