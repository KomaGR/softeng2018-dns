import * as mongoose from 'mongoose';
import * as UserModel from '../models/UserModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const User = mongoose.model('User', UserModel.UserSchema);

export class UserController {

    // add a new user on database
    public addNewUser(req: Request, res: Response) {
        let newUser = new User(req.body);

        newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    // get all users (according to query) from database
    public getUser(req: Request, res: Response) {
        User.find({}, (err, user) => {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    }

    public getUserWithID(req: Request, res: Response) {
        User.findById(
            { _id: req.params.userId },
            (err, user) => {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
    }

    public updateUser(req: Request, res: Response) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            req.body, { new: true }, (err, user) => {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
    }

    public deleteUser(req: Request, res: Response) {
        User.remove(
            { _id: req.params.userId },
            (err: any) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Successfully deleted user!' });
            });
    }


}