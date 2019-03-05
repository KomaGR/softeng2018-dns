const app = require("../app");
const request = require('supertest');
const async = require('async');

describe('Testing POST', () => {
    
    var server;
    var stoken;

    beforeAll(() => {
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

    test('Should return 201 on valid posts', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'thelo@na', username: 'pethano', password: 'tora'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results, cb) => request(server)
                    .post('/observatory/api/login')
                    .send({username: 'pethano', password: 'tora'})
                    .set('Accept', 'application/json')
                    .expect(200, cb),
            (results, cb) => { 
                    stoken = results.body.token;
                    cb(null, results);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .send({name: "test_prod_name", description: "test_prod_desc", category: "test_prod_cat", tags: "test_prod_tag"})
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(201, cb);
            },
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

    test('Should return Anauthorized when not logged in', (done) => {
        request(server)
            .post('/observatory/api/products')
            .send({name: "test_prod_name", description: "test_prod_desc", category: "test_prod_cat", tags: "test_prod_tag"})
            .set('Accept', 'application/json').then((res) => {
                expect(res.statusCode).toBe(401);
                done();    
            });
            
    });

    test('Should return 400 on invalid posts', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'thelo@na', username: 'pethano', password: 'tora'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results, cb) => request(server)
                    .post('/observatory/api/login')
                    .send({username: 'pethano', password: 'tora'})
                    .set('Accept', 'application/json')
                    .expect(200, cb),
            (results, cb) => { 
                    stoken = results.body.token;
                    cb(null, results);
            },
            (results, cb) => {
                request(server)
                    .post('/observatory/api/products')
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': stoken
                    })
                    .expect(400, cb);
            },
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
