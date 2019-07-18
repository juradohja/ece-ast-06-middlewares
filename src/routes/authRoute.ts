import express = require('express');
import session = require('express-session');
import {User} from '../user';

module.exports = function(dbUser) {
    const authRouter = express.Router();

    // Render Login
    authRouter.get('/login', function (req: any, res: any) {
        res.render('login')
    });

    // Perform Login
    authRouter.post('/login', function (req: any, res: any, next: any) {
        dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
            if (err) next(err);
            if (result === null || !result.validatePassword(req.body.password)) {
                console.log('login failed');
                console.log(result);
                console.log(req.session);
                res.redirect('/login')
            } else {
                req.session.loggedIn = true;
                req.session.userRoute = result;
                console.log('success login');
                res.redirect('/')
            }
        })
    });

    // Render SIGN UP
    authRouter.get('/signup', function (req: any, res: any) {
        res.render('signup')
    });

    // LOG OUT user
    authRouter.get('/logout', function (req: any, res: any) {
        if (req.session.loggedIn) {
            delete req.session.loggedIn;
            delete req.session.userRoute;
        }
        res.redirect('/login')
    });

    return authRouter;
}