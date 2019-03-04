import app from '../app';
const request = require('supertest');

describe('Test the root path', () => {
    beforeAll(() => {
        app.mongoSetup();
    });
    afterAll((done) => {
        app.db.close();
    });

    test('Responds', (done) => {
        return request(app).get('/observatory/api/products').expect(200);
    });
});
