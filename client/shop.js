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

exports.submit = shopSubmit;