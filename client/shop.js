const https = require('https');
const request = require('request');

function shopSubmit(req, res) {
    var shopid = req.body.shopId;
    console.log("the shop id is:" + shopid);
    if (shopid != null) {
        const session = req.session;
        res.render("submit_product.ejs",{
            shopId: shopid,
            session: session  
        });
    } else {
        // Shops can't be withdrawn just when submited
        const options = {
            url: 'https://localhost:8765/observatory/api/shops',
            rejectUnauthorized: false,
            form: {
                name: req.body.name,
                address: req.body.address,
                lng: req.body.lng,
                lat: req.body.lat,
                tags: req.body.tags,
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
                const session = req.session;
                res.status(200).render("submit_product.ejs",{
                    shopId: jsonBody.id,
                    session: session  
                });
            }
        })
    }
}

function shopInfo(req, res){
    var shopId = req.body.shopId;
    var dateTo = req.body.dateto;
    var dateFrom = req.body.datefrom;
    const session = req.session;
    const options = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/shops/' + shopId,
        rejectUnauthorized: false,
        method: 'GET'
    };
    var shopdata;
    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            shopdata = JSON.parse(d);
            const options1 = {
                hostname: 'localhost',
                port: 8765,
                path: '/observatory/api/prices/?shops=' + shopId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo,
                rejectUnauthorized: false,
                method: 'GET'
            };
            const httpsreq1 = https.request(options1, (httpsres) => {
                console.log('statuscode', httpsres.statusCode);
                httpsres.on('data', (d) => {
                    var mydata = JSON.parse(d);
                    var pricedata = mydata.prices;
                    console.log("this is the price data" + pricedata);

                    const options2 = {
                        hostname: 'localhost',
                        port: 8765,
                        path: '/observatory/api/products/' + pricedata.productId,
                        rejectUnauthorized: false,
                        method: 'GET'
                    };
                    const httpsreq2 = https.request(options2, (httpsres) => {
                        console.log('statuscode', httpsres.statusCode);
                        httpsres.on('data', (d) => {
                            var myproductdata = JSON.parse(d);
                            res.render('shop_info.ejs', {
                                shopData: shopdata,
                                priceData: pricedata,
                                productData: myproductdata,
                                session: session  
                            });
                        });
                    });
                    httpsreq2.on('error', (e) => {
                        console.error(e);
                    });
                    httpsreq2.end();
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

function shopPutInfo(req, res) {

    var shopid = req.body.shopID;

    const options = {
        url: 'https://localhost:8765/observatory/api/shops/' + shopid,
        rejectUnauthorized: false,
        form: {
            id: shopid,
            name: req.body.shopname,
            address: req.body.shopaddress,
            lng: req.body.shoplng,
            lat: req.body.shoplat,
            tags: req.body.shoptags
        },
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };

    request.put(options, (err, httpsResponse, body) =>{
       
        if (httpsResponse.statusCode == 200){
            res.redirect('/');
        }
    });
}
function shopDeleteInfo(req, res) {

    var shopid = req.body.shopID;
    const options = {
        url: 'https://localhost:8765/observatory/api/shops/' + shopid,
        rejectUnauthorized: false,
        headers: {
            'X-OBSERVATORY-AUTH': req.session.auth_token
        }
    };

    request.delete(options, (err, httpsResponse, body) =>{
       
        if (httpsResponse.statusCode == 200){
            const data = JSON.parse(body); 
            res.redirect('/');
        }
    });
}

exports.submit = shopSubmit;
exports.info = shopInfo;
exports.putInfo = shopPutInfo;
exports.deleteInfo = shopDeleteInfo;