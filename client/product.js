const https = require('https');
const request = require('request');

function productSubmitRoute(req, res) {

    const options = {
        url: 'https://localhost:8765/observatory/api/products',
        rejectUnauthorized: false,
        form: {
            name: req.body.productname,
            description: req.body.productdescription,
            category: req.body.productcategory,
            tags: req.body.producttags,
            withdrawn: false
        },
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };    
    request.post(options, (err, httpsResponse, body) => {
        if (err) {
            res.send(err);
        }
        console.log('#Front# statuscode:', httpsResponse.statusCode);
        if (httpsResponse.statusCode == 200) {
            const jsonBody = JSON.parse(body);
            var prodId = jsonBody.id;

            const options1 = {
                url: 'https://localhost:8765/observatory/api/prices',
                rejectUnauthorized: false,
                form: {
                    price: req.body.productprice,
                    dateFrom: req.body.datefrom,
                    dateTo: req.body.dateto,
                    productId: prodId,
                    shopId: req.body.shopId
                },
                headers: {
                    'X-OBSERVATORY-AUTH': req.session.auth_token
                }
            };    
            request.post(options1, (err, httpsResponse, body) => {
                if (err) {
                    res.send(err);
                }
                console.log('stelios');
                console.log('#Front# statuscode:', httpsResponse.statusCode);
                if (httpsResponse.statusCode == 200) {
                    res.status(200).redirect('/');
                }
            })
        }
    })
}

function productGetInfo(req, res) {

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
            var productdata = JSON.parse(d);
            const session = req.session;
            const options1 = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/prices/?products=' + productid,
                rejectUnauthorized: false,
                method: 'GET'
            };
        
            const httpsreq1 = https.request(options1, (httpsres) => {
                console.log('statuscode', httpsres.statusCode);
                httpsres.on('data', (d) => {
                    var pricedata = JSON.parse(d);
                    var prices = pricedata.prices;
                    const session = req.session;
                    res.render("product_info.ejs", {
                        product: productdata,
                        prices: prices,
                        session: session
                    });
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

function productPutInfo(req, res) {

    var productid = req.body.productID;
    console.log( "this is the product is ------" + req.body.productname);

    const options = {
        url: 'https://localhost:8765/observatory/api/products/' + productid,
        rejectUnauthorized: false,
        form: {
            name: req.body.productname,
            description: req.body.productdescription,
            category: req.body.productcategory,
            tags: req.body.producttags
        },
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };

    request.put(options, (err, httpsResponse, body) =>{
       
        if (httpsResponse.statusCode == 200){
            const data = JSON.parse(body); 
            res.render("product_info.ejs", {
                product: data,
                session: req.session
            })
        }
    });
}
function productDeleteInfo(req, res) {

    var productid = req.body.productID;
    console.log( "this is the product is ------" + req.body.productname);

    const options = {
        url: 'https://localhost:8765/observatory/api/products/' + productid,
        rejectUnauthorized: false,
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };

    request.delete(options, (err, httpsResponse, body) =>{
       
        if (httpsResponse.statusCode == 200){
            res.redirect('/');
        }
    });
}

exports.submit = productSubmitRoute;
exports.getInfo = productGetInfo;
exports.putInfo = productPutInfo;
exports.deleteInfo = productDeleteInfo;