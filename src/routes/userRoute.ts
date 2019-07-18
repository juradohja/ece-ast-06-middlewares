import express = require('express');

import {User, UserHandler} from '../user';

module.exports = function(db, dbUser) {
    const userRouter = express.Router();

    // Create User
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

    userRouter.get('/:username', (req: any, res: any) => {
        dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
            if (err || result === undefined) {
                res.status(404).send("user not found")
            } else res.status(200).json(result)
        })
    });

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