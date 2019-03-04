
const session = require('express-session');
const https = require('https');
const auth = require('./auth');
const product = require('./product');
const shop = require('./shop');
const request = require('request');



const redirectLogin = (req, res, next) => {
    if (!req.session.auth_token) {
        res.redirect('/');
    } else {
        next();
    }
};

const redirectHome = (req, res, next) => {
    if (req.session.auth_token) {
        res.redirect('/');
    } else {
        next();
    }
};

const redirectNonAdmin = (req, res, next) => {
    if (req.session.role != 'admin') {
        res.redirect('/');
    } else {
        next();
    }
};
function routes(app) {
    app
    .use(auth.session)

    .get("/", function (req, res) {
         console.log(req.session);
         const session = req.session;
         console.log(auth_token);
         const options = {
            url: 'https://localhost:8765/observatory/api/shops',
            rejectUnauthorized: false
        };    
        request.get(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                const jsonBody = JSON.parse(body);
                res.status(200).render("homepage.ejs", {
                    session: session,
                    response: response,
                    shops: jsonBody.shops
                });
            }
        });
     })

     .post("/map", function(req,res){
        var data = req.body;
        console.log(data);
        if ( data.new ){
            console.log("ZONK!");
        };
        res.redirect('/');
     })

     .get("/search_results", function (req, res) {
        var searchTerm = req.query.search_term;
        
        
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/products',
            rejectUnauthorized: false,
            method: 'GET'
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            httpsres.on('data', (d) => {
                var mydata = JSON.parse(d);
                var myproducts = mydata.products.filter(function (entry) {
                    return (entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        entry.category.toLowerCase().includes(searchTerm.toLowerCase()));
                });
                const session = req.session;
                res.render("search_results.ejs", {
                    myproducts: myproducts,
                    session: session 
                });
            });
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();

       

    })
    
    .post("/search_results", function (req, res) {
        res.redirect('/product_info');
    })
    
    .get("/about", function (req, res) {
        const session = req.session;
        res.render("about.ejs", {
            session: session  
        });      
         
    })
    
    .get("/login", redirectHome, function (req, res) {
        res.redirect('/');
    })
    
    .post("/login", redirectHome, auth.login)
    
    .get("/sign_up", redirectHome, function (req, res) {
        res.render("sign_up.ejs");
    })
    
    .post("/sign_up", redirectHome, auth.signup)
    
    .get("/logout", redirectLogin, auth.logout)
    
    .get("/submit_product", redirectLogin, function (req, res) {
        const session = req.session;

        res.render("submit_product.ejs", {
            session: session
        });
    })
    
    .post("/submit_product", redirectLogin, product.submit)
    
    .get("/product_info", product.getInfo)
    
    .post("/product_info_submit", product.putInfo)
    
    .post("/product_info_delete", product.deleteInfo)
    
    .get("/submit_shop", redirectLogin, function (req, res) {
        console.log(req.session);
         const session = req.session;
         console.log(auth_token);
         const options = {
            url: 'https://localhost:8765/observatory/api/shops',
            rejectUnauthorized: false
        };    
        request.get(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                const jsonBody = JSON.parse(body);
                res.status(200).render("submit_shop.ejs", {
                    session: session,
                    shops: jsonBody.shops
                });
            }
        });
    })
    
    .post("/submit_shop", redirectLogin, shop.submit)

    .post("/shop_info", shop.info)

    .get("/admin_hub", redirectNonAdmin, function(req, res){
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users',
            rejectUnauthorized: false,
            method: 'GET',
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            httpsres.on('data', (d) => {
                var mydata = JSON.parse(d);
                const session = req.session;
                res.render("admin_hub.ejs", {
                    users: mydata,
                    session: session  
                });
            });
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    })

    .patch("/adminUpgrade", redirectLogin, function(req, res){
        var userId = req.body.admin;
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            method: 'PATCH',
            json: {
                "role": 'admin'
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            res.redirect('/admin_hub');
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    })

    .patch("/investorUpgrade", redirectLogin, function(req, res){
        var userId = req.body.investor;
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            method: 'PATCH',
            json: {
                "role": 'investor'
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            res.redirect('/admin_hub');
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    })

    .patch("/userDowngrade", redirectLogin, function(req, res){
        var userId = req.body.downgrade;
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            method: 'PATCH',
            json: {
                "role": 'user'
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            res.redirect('/admin_hub');
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    })

    .patch("/userLock", redirectLogin, function(req, res){
        var userId = req.body.lock;
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            method: 'PATCH',
            json: {
                "locked": true
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            res.redirect('/admin_hub');
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    })

    .patch("/userUnlock", redirectLogin, function(req, res){
        var userId = req.body.unlock;
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            method: 'PATCH',
            json: {
                "locked": false
            }
        };
        const httpsreq = https.request(options, (httpsres) => {
            console.log('statuscode', httpsres.statusCode);
            res.redirect('/admin_hub');
        });
        httpsreq.on('error', (e) => {
            console.error(e);
        });
        httpsreq.end();
    });

 }

exports.default = routes;