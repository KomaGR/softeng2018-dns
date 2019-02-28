const https = require('https');

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
        method: 'GET'
    };

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            res.render("product_info.ejs", {
                product: mydata
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