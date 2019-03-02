
const session = require('express-session');
const https = require('https');
const auth = require('./auth');
const product = require('./product');
const shop = require('./shop');


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

function routes(app) {
    app
    .use(auth.session)

    .get("/", function (req, res) {
         console.log(req.session);
         const { auth_token } = req.session;
         console.log(auth_token);
         res.render("homepage.ejs", {
             token: auth_token
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
                const { auth_token } = req.session;
                res.render("search_results.ejs", {
                    myproducts: myproducts,
                    token: auth_token  

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
        const { auth_token } = req.session;
        res.render("about.ejs", {
            token: auth_token  
        });      
         
    })
    
    .get("/login", redirectHome, function (req, res) {
        res.redirect('/');

        // res.render("login.ejs");
    })
    
    .post("/login", redirectHome, auth.login)
    
    .get("/sign_up", redirectHome, function (req, res) {
        res.render("sign_up.ejs");
    })
    
    .post("/sign_up", redirectHome, auth.signup)
    
    .get("/logout", redirectLogin, auth.logout)
    
    .get("/submit_product",  function (req, res) {
        const { auth_token } = req.session;

        res.render("submit_product.ejs", {
            token: auth_token
        });
    })
    
    .post("/submit_product", redirectLogin, product.submit)
    
    .get("/product_info", product.getInfo)
    
    .put("/product_info", product.putInfo)
    
    .delete("/product_info", product.deleteInfo)
    
    .get("/submit_shop", redirectLogin, function (req, res) {
        res.render("map.ejs");
    })
    
    .post("/submit_shop", redirectLogin, shop.submit);

 }

exports.default = routes;