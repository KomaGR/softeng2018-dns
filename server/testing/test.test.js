const app = require("../app");
const request = require('supertest');
const async = require('async');
const data = require('./test-data.json');




describe('Test', () => {

    var server;
    var stoken;
    var prodId;

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
                    .expect(201, cb);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: data.products[1].name, description: data.products[1].description, category: data.products[1].category, tags: data.products[1].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(201, cb);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: data.products[2].name, description: data.products[2].description, category: data.products[2].category, tags: data.products[2].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(201, cb);
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
                expect(prodId).toBeUndefined();
                prodId = results.body.products[0].id;
                expect(prodId).toBeDefined();
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
                    .expect(201, cb)
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/shops')
                    .send({name: data.shops[1].name, address: data.shops[1].address, lng: data.shops[1].lng, lat: data.shops[1].lat, tags: data.shops[1].tags})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(201, cb)
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
                cb(null, results);
            },

            /////////////////
            // POST Prices //
            /////////////////

            //TODO: see what get products returns for product id, same for shops.

            // (results, cb) => {
            //     request(server)
            //         .post('/observatory/api/prices')
            //         .send({price: data.prices[0].price, dateFrom: data.prices[0].dateFrom, dateTo: data.prices[0].dateTo, productId: })
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
