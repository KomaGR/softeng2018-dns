const https = require('https');
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
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: true
    }
})

function loginRoute(req, res) {

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/login',
        rejectUnauthorized: false,
        method: 'POST',
        json: {
            "username": req.body.l_username,
            "password": req.body.l_password
        }
    };

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            if (mydata.token == 'deadbeef') {
                req.session.auth_token = mydata.token;
                return res.redirect('/');
            }
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();
}

function logoutRoute(req, res) {

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/logout',
        rejectUnauthorized: false,
        method: 'POST'
    };

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            if (mydata.message == 'OK') {
                req.session.destroy(err => {
                    if (err) {
                        return res.redirect('/');
                    }
                    res.clearCookie(SESSION_ID);
                    res.redirect('/');
                })
            } else {
            }
        });
    });
    
    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();
}

function signupRoute(req, res) {

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/signup',
        rejectUnauthorized: false,
        method: 'POST',
        json: {
            "email": req.body.s_email,
            "username": req.body.s_username,
            "password": req.body.s_password
        }
    };

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            if (mydata.message == 'OK') {
                res.redirect('/login');
            } else {

            }
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });
    
    httpsreq.end();
}

exports.login = loginRoute;
exports.logout = logoutRoute;
exports.signup = signupRoute;