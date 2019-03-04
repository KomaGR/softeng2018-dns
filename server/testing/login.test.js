const app = require("../app");
const request = require('supertest');
const async = require('async');




describe('Login endpoints', () => {

    var server;

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

    // beforeEach((done) => {
    //     app.default.db.dropDatabase( () => {
    //         done();
    //     });
    // });

    // afterEach((done) => {
    //     app.default.db.dropDatabase( () => {
    //         done();
    //     });
    // });

    test('Empty POST /login is Bad Request', (done) => {
        request(server)
        .post('/observatory/api/login')
        .then((res) => {
            expect(res.statusCode).toBe(400);
            done();
        });
    });

    test('POST /signup new user', (done) => {
        request(server)
        .post('/observatory/api/signup')
        .send({email: 'username@example.com', username: 'testname', password: '12345'})
        .set('Accept', 'application/json')
        .expect(201, done);    
    });
    
    test('POST /login existing user', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'username1@example', username: 'testname1', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results, cb) => request(server)
                .post('/observatory/api/login')
                .send({username: 'testname1', password: '12345'})
                .set('Accept', 'application/json')
                .expect(200, cb)
        ], (err, res) => {
            if (err) done(err);
            expect(res.body.token).toBeDefined();
            expect(res.body.token).toBeString();
            
            done();
        });
    });

    test('POST /logout logged in user', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'username3@example', username: 'testname3', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results1, cb) => request(server)
                    .post('/observatory/api/login')
                    .send({username: 'testname3', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(200, cb),
            (results2, cb) => request(server)
                    .post('/observatory/api/logout')
                    .set({
                        'Accept': 'application/json',
                        'X-OBSERVATORY-AUTH': results2.body.token      
                    })
                    .expect(200, cb)
        ], (err, res) => {
            if(err) done(err);
            expect(res.statusCode).toBe(200);
            
            done();
        });
    });

    // TODO: Something is amiss with this test.
    test('POST /signup existing user fails', (done) => {
        async.waterfall([
            (cb) => request(server)
                    .post('/observatory/api/signup')
                    .send({email: 'username2@example.com', username: 'testname2', password: '12345'})
                    .set('Accept', 'application/json')
                    .expect(201, cb),
            (results, cb) => request(server)
                .post('/observatory/api/signup')
                .send({email: 'username2@example.com', username: 'testname2', password: '12345'})
                .set('Accept', 'application/json')
                .expect(403, cb)
        ], (err, res) => {
            if (err) done(err);
            done();
        });
    });
    
});
