const https = require('https');
const request = require('request');

function shopSubmit(req, res) {
    var shopid = req.body.shopId;
    console.log("the shop id is:" + shopid);
    if (shopid != null) {
        const { auth_token } = req.session;
        res.render("submit_product.ejs",{
            shopId: shopid,
            token: auth_token  
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
                const { auth_token } = req.session;
                res.status(200).render("submit_product.ejs",{
                    shopId: jsonBody.id,
                    token: auth_token  
                });
            }
        })
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