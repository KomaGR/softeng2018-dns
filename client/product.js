const https = require('https');
const request = require('request');

function productSubmitRoute(req, res) {
    var prodid = req.body.prodid;
    if (prodid) {

    } else {

        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/products',
            rejectUnauthorized: false,
            method: 'POST',
            json: {
                "name": req.body.productname,
                "description": req.body.productdescription,
                "category": req.body.productcategory,
                "tags": req.body.producttags,
                "withdrawn": false
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
                        "price": req.body.productprice,
                        "dateFrom": req.body.datefrom,
                        "dateTo": req.body.dateto,
                        "productId": mydata.id,
                        "shopId": req.body.shopID
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
}

function productGetInfo(req, res) {

    var productid = req.query.productID;
    console.log(productid);

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/products/' + productid,
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
            res.render("product_info.ejs", {
                product: mydata,
                session: session

            });
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
    console.log( "this is the product is ------" + productid);

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