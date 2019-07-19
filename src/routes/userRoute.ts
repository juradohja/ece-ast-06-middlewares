import express = require('express');

import {User, UserHandler} from '../user';

module.exports = function(db, dbUser) {
    const userRouter = express.Router();

    // Create an User / Sign Up
    userRouter.post('/', function (req: any, res: any, next: any) {
        dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
            if (err) next(err);
            if (result) {
                res.status(409).render('./error.ejs', {errorCode: 409})
            } else {
                let user = new User(req.body.username, req.body.email, req.body.password, false);
                dbUser.save(user, function (err: Error | null) {
                    if (err) next(err);
                    else {
                        req.session.loggedIn = true;
                        req.session.userRoute = user;
                        res.status(201).redirect('/')
                    }
                })
            }
        })
    });

    // Delete User
    userRouter.delete('/', (req: any, res: any) => {
        new UserHandler(db).delete(req.body.username, (err: any, result: any) => {
                if (err)
                    return res.status(500).json({error: err, result: result});
                res.status(201).json({error: err, result: true})
            }
        )
    });

    return userRouter;
}