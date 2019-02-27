const https = require('https');

function shopSubmit(req, res) {
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
}

exports.submit = shopSubmit;