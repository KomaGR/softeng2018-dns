const app = require("../app");
const request = require('supertest');
const async = require('async');
const data = require('./test-data.json');




describe('Test', () => {

    var server;
    var stoken;
    var prodId = new Array(3);
    var shopId = new Array(3);

    beforeAll(() => {
        console.log('Starting before all');
        app.default.mongoSetup();
        server = app.default.app.listen(8765, () => {
            console.log('REST API listening at port 8765');            
        })
    });

    afterAll((done) => {
        async.waterfall([
            (cb) => app.default.db.dropDatabase(cb),
            (res,cb) => app.default.db.close(cb),
            (res,cb) => server.close(cb)
        ], (err, res) => {
            if (err) done(err);
            done();
        });
        
    });

    test.only('Ultra Mega Big Test', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'username3@example', username: 'testname3', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results, cb) => request(server)
                    .post('/observatory/api/login')
                    .send({username: 'testname3', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(200, cb),
            (results, cb) => {expect(results.body.token).toBeDefined(); cb(null, results);},
            (results, cb) => {expect(stoken).toBeUndefined; 
                            expect(results.body.token).toBeDefined();
                            stoken = results.body.token;
                            expect(stoken).toBeDefined;
                            cb(null, results);},
            (results, cb) => {expect(stoken).toBeDefined(); cb(null, results);},

            ///////////////////
            // POST Products //
            ///////////////////

            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: data.products[0].name, description: data.products[0].description, category: data.products[0].category, tags: data.products[0].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: data.products[1].name, description: data.products[1].description, category: data.products[1].category, tags: data.products[1].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: data.products[2].name, description: data.products[2].description, category: data.products[2].category, tags: data.products[2].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb);
            },
            
            //////////////////
            // GET Products //
            //////////////////

            (results, cb) => {
                request(server)
                    .get('/observatory/api/products')
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect('Content-Type', /json/)
                    .expect(200, cb);
            },
            (results, cb) => {
                expect(results.body.products[0].id).toBeDefined();
                //expect(prodId).toBeUndefined();
                prodId[0] = results.body.products[0].id;
                prodId[1] = results.body.products[1].id;
                prodId[2] = results.body.products[2].id;
                //expect(prodId).toBeDefined();
                cb(null, results);
            },

            ////////////////
            // POST Shops //
            ////////////////

            (results, cb) => {
                request(server)
                    .post('/observatory/api/shops')
                    .send({name: data.shops[0].name, address: data.shops[0].address, lng: data.shops[0].lng, lat: data.shops[0].lat, tags: data.shops[0].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/shops')
                    .send({name: data.shops[1].name, address: data.shops[1].address, lng: data.shops[1].lng, lat: data.shops[1].lat, tags: data.shops[1].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/shops')
                    .send({name: data.shops[2].name, address: data.shops[2].address, lng: data.shops[2].lng, lat: data.shops[2].lat, tags: data.shops[2].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },

            ///////////////
            // GET Shops //
            ///////////////

            (results, cb) => {
                request(server)
                    .get('/observatory/api/shops')
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
                    .expect('Content-Type', /json/);
            },
            (results, cb) => {
                expect(results.body.shops[0].id).toBeDefined();
                shopId[0] = results.body.shops[0].id;
                shopId[1] = results.body.shops[1].id;
                shopId[2] = results.body.shops[2].id;
                cb(null, results);
            },

            /////////////////
            // POST Prices //
            /////////////////


            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[0].price, dateFrom: data.prices[0].dateFrom, dateTo: data.prices[0].dateTo, productId: prodId[data.prices[0].productIndex], shopId: shopId[data.prices[0].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[1].price, dateFrom: data.prices[1].dateFrom, dateTo: data.prices[1].dateTo, productId: prodId[data.prices[1].productIndex], shopId: shopId[data.prices[1].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[2].price, dateFrom: data.prices[2].dateFrom, dateTo: data.prices[2].dateTo, productId: prodId[data.prices[2].productIndex], shopId: shopId[data.prices[2].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[3].price, dateFrom: data.prices[3].dateFrom, dateTo: data.prices[3].dateTo, productId: prodId[data.prices[3].productIndex], shopId: shopId[data.prices[3].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[4].price, dateFrom: data.prices[4].dateFrom, dateTo: data.prices[4].dateTo, productId: prodId[data.prices[4].productIndex], shopId: shopId[data.prices[4].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[5].price, dateFrom: data.prices[5].dateFrom, dateTo: data.prices[5].dateTo, productId: prodId[data.prices[5].productIndex], shopId: shopId[data.prices[5].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[6].price, dateFrom: data.prices[6].dateFrom, dateTo: data.prices[6].dateTo, productId: prodId[data.prices[6].productIndex], shopId: shopId[data.prices[6].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[7].price, dateFrom: data.prices[7].dateFrom, dateTo: data.prices[7].dateTo, productId: prodId[data.prices[7].productIndex], shopId: shopId[data.prices[7].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/prices')
                    .send({price: data.prices[8].price, dateFrom: data.prices[8].dateFrom, dateTo: data.prices[8].dateTo, productId: prodId[data.prices[8].productIndex], shopId: shopId[data.prices[8].shopIndex]})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(200, cb)
            },

            ////////////////
            // GET Prices //
            ////////////////

            // (results, cb) => {
            //     request(server)
            //         .get('/observatory/api/prices')
            //         .set({
            //             'Accept': 'application/json',
            //             'X-OBSERVATORY-AUTH': stoken
            //         })
            //         .expect(200, cb)
            // },

            ////////////
            // Logout //
            ////////////

            (results, cb) => request(server)
                    .post('/observatory/api/logout')
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken      
                    })
                    .expect(200, cb)
        ], (err, res) => {
            if(err) done(err);
            expect(res.statusCode).toBe(200);
            
            done();
        });
    });
    
});
