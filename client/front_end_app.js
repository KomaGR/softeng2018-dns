"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const session = require('express-session');
const https = require('https');
const bodyParser = require("body-parser");
const routes_1 = require("../server/routes/routes");
const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
    SESSION_LIFETIME = TWO_HOURS,
    SESSION_ID = 'X-OBSERVATORY-AUTH'
} = process.env;
var SESSION_SECRET = 'zonk';

const redirectLogin = (req, res, next) => {
    if (!req.session.auth_token) {
        res.redirect('/login');
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

class Front_end_app {
    constructor() {
        this.front_end_app = express();
        this.config();
        this.staticConfig();
    }
    config() {
        this.front_end_app.use(bodyParser.json());
        this.front_end_app.use(bodyParser.urlencoded({ extended: false }));
        routes_1.default(this.front_end_app);


        this.front_end_app.use(session({
            name: SESSION_ID,
            resave: false,
            saveUninitialized: false,
            secret: SESSION_SECRET,
            cookie: {
                maxAge: SESSION_LIFETIME,
                sameSite: true,
                secure: true
            }
        }));

        this.front_end_app.get("/", function (req, res) {
            console.log(req.session);
            const { auth_token } = req.session;
            console.log(auth_token);
            res.render("../client/pages/homepage.ejs", {
                token: auth_token
            });
        });

        this.front_end_app.get("/search_results", function (req, res) {
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
                    res.render("../client/pages/search_results.ejs", {
                        myproducts: myproducts
                    });
                });
            });
            httpsreq.on('error', (e) => {
                console.error(e);
            });
            httpsreq.end();
        });

        this.front_end_app.post("search_results", function (req, res) {
            res.redirect('/product_info');
        });

        this.front_end_app.get("/about", function (req, res) {
            res.render("../client/pages/about.ejs");
        });

        this.front_end_app.get("/login", redirectHome, function (req, res) {
            res.render("../client/pages/login.ejs");
        });

        this.front_end_app.post("/login", redirectHome, function (req, res) {
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
        });

        this.front_end_app.get("/sign_up", redirectHome, function (req, res) {
            res.render("../client/pages/sign_up.ejs");
        });

        this.front_end_app.post("/sign_up", redirectHome, function (req, res) {
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
        });

        this.front_end_app.get("/logout", redirectLogin, function (req, res) {
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
        });

        this.front_end_app.get("/submit_product", redirectLogin, function (req, res) {
            res.render("../client/pages/submit_product.ejs");
        });

        this.front_end_app.post("/submit_product", redirectLogin, function (req, res) {
            var prodid = req.body.prodid;
            if (prodid) {

            } else {
                var productName = req.body.productname;
                var productDescription = req.body.productdescription;
                var productCategory = req.body.productcategory;
                var productTags = req.body.producttags;
                var productPrice = req.body.productprice;
                var DateFrom = req.body.datefrom;
                var DateTo = req.body.dateto;
                var shopID = req.body.shopID;
                var withdrawn = false;
                const options = {
                    hostname: 'localhost',
                    port: 8765,
                    path: '/observatory/api/products',
                    rejectUnauthorized: false,
                    method: 'POST',
                    json: {
                        "name": productName,
                        "description": productDescription,
                        "category": productCategory,
                        "tags": productTags,
                        "withdrawn": withdrawn
                    }
                };
                const httpsreq = https.request(options, (httpsres) => {
                    console.log('statuscode', httpsres.statusCode);
                    httpsres.on('data', (d) => {
                        var mydata = JSON.parse(d);
                        const options1 = {
                            hostname: 'localhost',
                            port: 8765,
                            path: '/observatory/api/prices',
                            rejectUnauthorized: false,
                            method: 'POST',
                            json: {
                                "price": productPrice,
                                "dateFrom": DateFrom,
                                "dateTo": DateTo,
                                "productId": mydata.id,
                                "shopId": shopID
                            }
                        };
                        const httpsreq1 = https.request(options, (httpsres) => {
                            console.log('statuscode', httpsres.statusCode);
                            httpsres.on('data', (d) => {
                            });
                        });
                        httpsreq1.on('error', (e) => {
                            console.error(e);
                        });
                        httpsreq1.end();
                    });
                });
                httpsreq.on('error', (e) => {
                    console.error(e);
                });
                httpsreq.end();
            }
        });

        this.front_end_app.get("/product_info", function (req, res) {
            var productid = req.query.productID;
            console.log(productid);
            const options = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/products/' + productid,
                rejectUnauthorized: false,
                method: 'GET'
            };
            const httpsreq = https.request(options, (httpsres) => {
                console.log('statuscode', httpsres.statusCode);
                httpsres.on('data', (d) => {
                    var mydata = JSON.parse(d);
                    res.render("../client/pages/product_info.ejs", {
                        product: mydata
                    });
                });
            });
            httpsreq.on('error', (e) => {
                console.error(e);
            });
            httpsreq.end();
        });

        this.front_end_app.put("/product_info", function (req, res) {
            var productid = req.query.productID;
            var productName = req.body.productname;
            var productDescription = req.body.productdescription;
            var productCategory = req.body.productcategory;
            var productTags = req.body.producttags;
            console.log(productid);
            const options = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/products/' + productid,
                rejectUnauthorized: false,
                method: 'PUT',
                json: {
                    "name": productName,
                    "description": productDescription,
                    "category": productCategory,
                    "tags": productTags
                }
            };
            const httpsreq = https.request(options, (httpsres) => {
                console.log('statuscode', httpsres.statusCode);
                httpsres.on('data', (d) => {
                    var mydata = JSON.parse(d);
                    res.render("../client/pages/product_info.ejs");
                });
            });
            httpsreq.on('error', (e) => {
                console.error(e);
            });
            httpsreq.end();
        });

        this.front_end_app.delete("/product_info", function (req, res) {
            var productid = req.body.productID;
            console.log(productid);
            const options = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/products/' + productid,
                rejectUnauthorized: false,
                method: 'DELETE'
            };
            const httpsreq = https.request(options, (httpsres) => {
                console.log('statuscode', httpsres.statusCode);
                httpsres.on('data', (d) => {
                    var mydata = JSON.parse(d);
                    res.render("../client/pages/product_info.ejs");
                });
            });
            httpsreq.on('error', (e) => {
                console.error(e);
            });
            httpsreq.end();
        });

        this.front_end_app.get("/submit_shop", redirectLogin, function (req, res) {
            res.render("../client/pages/submit_shop.ejs");
        });

        this.front_end_app.post("/submit_shop", redirectLogin, function (req, res) {
            var shopid = req.body.shopid;
            if (shopid) {

            } else {
                var shopName = req.body.shopname;
                var shopAddress = req.body.shopaddress;
                var shopLng = req.body.shopLng;
                var shopLat = req.body.shopLat;
                var shopTags = req.body.shoptags;
                var withdrawn = false;
                const options = {
                    hostname: 'localhost',
                    port: 8765,
                    path: '/observatory/api/shops',
                    rejectUnauthorized: false,
                    method: 'POST',
                    json: {
                        "name": shopName,
                        "address": shopAddress,
                        "lng": shopLng,
                        "lat": shopLat,
                        "tags": shopTags,
                        "withdrawn": withdrawn
                    }
                };
                const httpsreq = https.request(options, (httpsres) => {
                    console.log('statuscode', httpsres.statusCode);
                    httpsres.on('data', (d) => {
                        var mydata = JSON.parse(d);
                        res.redirect('/submit_product', {
                            shopID: mydata.id
                        });
                    });
                });
                httpsreq.on('error', (e) => {
                    console.error(e);
                });
                httpsreq.end();
            }
        });
    }


    staticConfig() {
        this.front_end_app.use('/css', express.static('client/pages/css'));
        this.front_end_app.use('/images', express.static('client/pages/images'))
    }
}
exports.default = new Front_end_app().front_end_app;
//# sourceMappingURL=app.js.map