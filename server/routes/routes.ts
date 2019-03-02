import * as express from  'express';
import ProductRouter from './ProductRouter';
import ShopRouter from './ShopRouter';
import PriceRouter from './PriceRouter';
import UserController from '../controllers/UserController';
import { session_manager } from "../app";

type Request = express.Request;
type Response = express.Response;

const MainRouter = express.Router();
const user_controller = new UserController();

export default function (
    app: express.Application
) {
    app.use('/observatory/api', MainRouter);
    
    MainRouter
    .get('/', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api");        
        res.status(400).send({ message: "Bad Request" });
    })

    .post('/login', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/login");
        const username = req.body.username;
        const password = req.body.password;

        console.log(`Login: ${username} ${password}`);
        

        if (username && password) {
            user_controller.loginUser(req, res);
        } else {
            res.status(400).send({ message: "Bad Request" });
        }
    })
    .post('/logout', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/logout");
        const custom_header_token = req.get('X-OBSERVATORY-AUTH');
        if (session_manager.CheckSession(custom_header_token)) {
            if (session_manager.EndSession(custom_header_token)) {
                res.status(200).send({message : "OK"});
            } else {
                res.status(500).send({message: "Internal Server Error"});
            }
        } else {
            res.status(400).send({message: "Bad Request"});
        }
    })

    .post('/signup', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/signup");
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        console.log(`#Back# Signup: ${email} ${username} ${password}`);

        if (email && username && password) {
            user_controller.addNewUser(req, res);
        } else {
            res.status(400).send({ message: "Bad Request"});
        }

    })
    
    .use('/products', new ProductRouter().router)
    
    .use('/shops', new ShopRouter().router)
    
    .use('/prices', new PriceRouter().router)

}
