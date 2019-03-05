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

    var productId = req.body.productID;
    var dateTo = req.body.dateto;
    var dateFrom = req.body.datefrom;
    // var shopId = req.body.shopId;
    const session = req.session;
    console.log(productId);

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/products/' + productId,
        rejectUnauthorized: false,
        method: 'GET'
    };
    var productData;
    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            productData = JSON.parse(d);
            const options1 = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/prices/?products=' + productId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo,
                rejectUnauthorized: false,
                method: 'GET'
            };

        const httpsreqPrices = https.request(options1, (httpsres) => {
            console.log('statuscodde:', httpsres.statusCode);
            httpsres.on('data', (d) => {
                var mydata = JSON.parse(d);
                var priceData = mydata.prices;
                console.log('this is my data', mydata);
                const options2 = {
                    hostname: 'localhost',
                    port: 8765,
                    path: '/observatory/api/shops/' + priceData.shopId,
                    rejectUnauthorized: false,
                    method: 'GET' 
                };
                const httpsreqShops = https.request(options2, (httpsres) => {
                    console.log('statuscode', httpsres.statusCode);
                    httpsres.on('data', (d) => {
                        var shopData = JSON.parse(d);
                        res.render('product_info.ejs', {
                            shopData: shopData,
                            priceData: priceData,
                            product: productData,
                            session: session  
                        });
                    });
                });

                 httpsreqShops.on('error', (e) => {
                        console.error(e);
                    });
                    httpsreqShops.end();
                });
            });
            httpsreqPrices.on('error', (e) => {
                console.error(e);
            });
            httpsreqPrices.end();
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