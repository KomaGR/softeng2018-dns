const request = require('request');
const session = require('express-session');

const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
    SESSION_LIFETIME = TWO_HOURS,
    SESSION_ID = 'X-OBSERVATORY-AUTH'
} = process.env;
var SESSION_SECRET = 'zonk';

exports.session = session({
    name: SESSION_ID,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    auth_token: undefined,
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: true
    }
})

function loginRoute(req, res) {

    const options = {
        url: 'https://localhost:8765/observatory/api/login',
        rejectUnauthorized: false,
        form: {
            username: req.body.username,
            password: req.body.password
        }
    };

    console.log("#Front# To Login" + req.body.username + ' ' + req.body.password);

    request.post(options, (err, httpsResponse, body) => {
        if (err) {
            res.send(err);
        }
        console.log('#Front# statuscode:', httpsResponse.statusCode);
        if (httpsResponse.statusCode == 200) {
            const jsonBody = JSON.parse(body);
            console.log('#Front# token: ' + jsonBody.token);
            req.session.auth_token = jsonBody.token;
            res.status(200).redirect('/');
        }
    })
}

function logoutRoute(req, res) {
    const options = {
        url: 'https://localhost:8765/observatory/api/logout',
        rejectUnauthorized: false,
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };

    console.log("#Front# To Logout: " + req.session.auth_token);

    request.post(options, (err, httpsResponse, body) => {
        if (err) {
            res.send(err);
        }
        console.log('#Front# statuscode:', httpsResponse.statusCode);
        if (httpsResponse.statusCode == 200) {
            const jsonBody = JSON.parse(body);
            req.session.auth_token = undefined;
            res.status(200).redirect('/');
        }
    });
}

function signupRoute(req, res) {

    const options = {
        url: 'https://localhost:8765/observatory/api/signup',
        rejectUnauthorized: false,
        form: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
    };
    
    console.log("#Front# To Signup: " + req.body.username + ' ' + req.body.email + ' ' + req.body.password);

    request.post(options, (err, httpsResponse, body) => {
        if (err) {
            res.send(err);
        }
        console.log('statuscode', httpsResponse.statusCode);
        if (httpsResponse.statusCode == 201) {
            console.log(body.message);
            res.status(200).redirect('/');
        }
    });
}

exports.login = loginRoute;
exports.logout = logoutRoute;
exports.signup = signupRoute;