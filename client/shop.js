const https = require('https');

function shopSubmit(req, res) {
    var shopid = req.body.shopid;
    if (shopid) {

    } else {
        // Shops can't be withdrawn just when submited
        const options = {
            hostname: 'localhost',
            port: 8765,
            path: '/observatory/api/shops',
            rejectUnauthorized: false,
            method: 'POST',
            json: {
                "name": req.body.shopname,
                "address": req.body.shopaddress,
                "lng": req.body.shopLng,
                "lat": req.body.shopLat,
                "tags": req.body.shoptags,
                "withdrawn": false
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
}

function shopInfo(req, res){
    var shopId = req.body.shopId;
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
        });
    });
    httpsreq.on('error', (e) => {
        console.error(e);
    });
    httpsreq.end();

    const options1 = {
        hostname: 'localhost',
        port: 8765,
        path: '/observatory/api/prices/?shops=' + shopId,
        rejectUnauthorized: false,
        method: 'GET'
    };
    const httpsreq1 = https.request(options1, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            var mydata = JSON.parse(d);
            var pricedata = mydata.prices;
            res.render('shop_info.ejs', {
                shopData: shopdata,
                priceData: pricedata
            });
        });
    });
    httpsreq1.on('error', (e) => {
        console.error(e);
    });
    httpsreq1.end();
}

exports.submit = shopSubmit;
exports.info = shopInfo;