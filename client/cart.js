const https = require('https');
const session = require('express-session');

const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
}, {});

function CartReduce( productIDlist ){

    var starting_url = '/observatory/api/prices/';
    var final_url;
    var middleman;
    for (var i=0; i<productIDlist.length;i++){
        final_url = starting_url.concat('?products=');
        middleman = final_url.concat(productIDlist[i]);
        if ( i != productIDlist.length - 1){
            starting_url = middleman.concat('&');
        }
    }

    const options = {
        hostname: 'localhost',
        port: 8765,
        path: final_url,
        rejectUnauthorized: false,
        method: 'GET'
    };

    var mydata;

    const httpsreq = https.request(options, (httpsres) => {
        console.log('statuscode', httpsres.statusCode);
        httpsres.on('data', (d) => {
            mydata = JSON.parse(d);
        });
    });

    httpsreq.on('error', (e) => {
        console.error(e);
    });

    httpsreq.end();

    const groupByShopID = groupBy('shopId');
    console.log(
        JSON.stringify({
          productsByShopID: groupByShopID(mydata.prices)
        }, null, 2)
      );
}