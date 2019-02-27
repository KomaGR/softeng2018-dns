const https = require('https');

function loginRoute(req, res) {
    var username = req.body.l_username;
    var password = req.body.l_password;
    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/login',
        rejectUnauthorized: false,
        method: 'POST',
        json: {
            "username": username,
            "password": password
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
    var userEmail = req.body.s_email;
    var username = req.body.s_username;
    var userPassword = req.body.s_password;
    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/signup',
        rejectUnauthorized: false,
        method: 'POST',
        json: {
            "email": userEmail,
            "username": username,
            "password": userPassword
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