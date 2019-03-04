const app = require("../app");
const request = require('supertest');


describe('Test the root path', () => {

    var server;

    beforeAll(() => {
        app.default.mongoSetup();
        server = app.default.app.listen(8765, () => {
            console.log('REST API listening at port 8765');            
        })
    });

    afterAll((done) => {
        app.default.db.close();
        server.close();
    });

    test('Responds at products', (done) => {
        request(server).get('/observatory/api/products').expect(200);
        done();
    });

    test('Responds at shops', (done) => {
        request(server).get('/observatory/api/shops').expect(200);
        done();
    });

});