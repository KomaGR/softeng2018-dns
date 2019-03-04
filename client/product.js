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
            var mydata = JSON.parse(d);
            const { auth_token } = req.session;
            res.render("product_info.ejs", {
                product: mydata,
                token: auth_token

            });
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();
}

function productPutInfo(req, res) {

    var productid = req.query.productID;
    console.log(productid);

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/products/' + productid,
        rejectUnauthorized: false,
        method: 'PUT',
        json: {
            "name": req.body.productname,
            "description": req.body.productdescription,
            "category": req.body.productcategory,
            "tags": req.body.producttags
        }
    };

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            res.render("product_info.ejs");
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();
}

function productDeleteInfo(req, res) {

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
            res.render("product_info.ejs");
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();
}

exports.submit = productSubmitRoute;
exports.getInfo = productGetInfo;
exports.putInfo = productPutInfo;
exports.deleteInfo = productDeleteInfo;