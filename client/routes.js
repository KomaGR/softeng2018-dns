
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
         console.log(session.auth_token);
         const options = {
            url: 'https://localhost:8765/observatory/api/shops',
            rejectUnauthorized: false
        };    
        request.get(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            response= httpsResponse.statusCode;
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

    .post("/shop_info_submit", shop.putInfo)

    .post("/shop_info_delete", shop.deleteInfo)
    
    .get("/submit_shop", redirectLogin, function (req, res) {
        console.log(req.session);
         const session = req.session;
         console.log(session.auth_token);
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

    .post("/adminUpgrade", redirectLogin, function(req, res){
        var userId = req.body.admin;
        const options = {
            url: 'https://localhost:8765/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            form: {
                role: 'admin'
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };

        request.patch(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                res.redirect('/admin_hub');
            }
 
        })
    })

    .post("/investorUpgrade", redirectLogin, function(req, res){
        var userId = req.body.investor;
        const options = {
            url: 'https://localhost:8765/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            form: {
                role: 'investor'
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };

        request.patch(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                res.redirect('/admin_hub');
            }
 
        })
    
    })

    .post("/userDowngrade", redirectLogin, function(req, res){
        var userId = req.body.downgrade;
        const options = {
            url: 'https://localhost:8765/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            form: {
                role: 'user'
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };

        request.patch(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                res.redirect('/admin_hub');
            }
 
        })
    
    })

    .post("/userLock", redirectLogin, function(req, res){
        var userId = req.body.lock;
        const options = {
            url: 'https://localhost:8765/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            form: {
                locked: true
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };

        request.patch(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                res.redirect('/admin_hub');
            }
 
        })
    
    })

    .post("/userUnlock", redirectLogin, function(req, res){
        var userId = req.body.unlock;
        const options = {
            url: 'https://localhost:8765/observatory/api/users/' + userId,
            rejectUnauthorized: false,
            form: {
                locked: false
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };

        request.patch(options, (err, httpsResponse, body) => {
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 200) {
                res.redirect('/admin_hub');
            }
 
        })
    })
    
    .post("/change_price", redirectLogin, function(req,res){
        var prodId = req.body.productId;
        var shopId = req.body.shopId;
        const session = req.session;

        res.render("change_price.ejs", {
            productId: prodId,
            shopId: shopId,
            session: session
        });
    })
    
    .post("/change_price_real", redirectLogin, function(req, res){
        var prodId = req.body.productId;
        var shopId = req.body.shopId;
        var dateTo = req.body.dateto;
        var dateFrom = req.body.datefrom;
        var price = req.body.price;

        const options = {
            url: 'https://localhost:8765/observatory/api/prices',
            rejectUnauthorized: false,
            form: {
                productId: prodId,
                shopId: shopId,
                dateTo: dateTo,
                dateFrom: dateFrom,
                price: price
            },
            headers: {
                'X-OBSERVATORY-AUTH': req.session.auth_token
            }
        };
        
        request.post(options, (err, httpsResponse, body) => {
            console.log(httpsResponse.statusCode);
            if (err) {
                res.send(err);
            }
            if (httpsResponse.statusCode == 201) {                
                res.status(201).redirect('/');
            }   
        })
    })
    
    .post("/product_info_final", function(req,res){
        var dateTo = req.body.dateto;
        var dateFrom = req.body.datefrom;
        var productId = req.body.prodId;
        console.log("The product id is: " + productId);

        const options1 = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/prices/?products=' + productId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo,
            rejectUnauthorized: false,
            method: 'GET'
        };
        const httpsreq1 = https.request(options1, (httpsres) => {
            httpsres.on('data', (d) => {
                var mydata = JSON.parse(d);
                var real_prices = mydata.prices;
                const session = req.session;
                res.render("product_display.ejs", {
                    priceData: real_prices,
                    session: session  
                });
            });
        });
        httpsreq1.on('error', (e) => {
            console.error(e);
        });
        httpsreq1.end();
    })
    
    .post("/shop_location", function(req,res){
        var lat = req.body.shopLat;
        var lng = req.body.shopLng;
        const session = req.session;

        res.render("shop_location.ejs",{
            shopLat: lat,
            shopLng: lng,
            session: session
        })
    });

 }

exports.default = routes;