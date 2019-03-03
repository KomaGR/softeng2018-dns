import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

export function bounceStrangers(req: Request, res: Response, next) {
    if (res.locals.privilege === 'none') {
        
        res.status(401).send({ message: "Unauthorized"});
    } else {
        next();
    }
}

export function bounceNonAdmins(req: Request, res: Response, next) {
    if (res.locals.privilege !== 'admin') {
        res.status(401).send({ message: "Unauthorized" });
    } else {
        next();
    }
}