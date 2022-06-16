const supertest = require('supertest');
const app = require('../app');
const assert = require('assert');
const Store = require("../models/store");


const store = {
    name: 'Test Store',
    cuit: '123456',
    concepts: [1, 2, 3, 4, 5, 6],
    currentBalance: 123,
    active: true,
    lastSale: '2022-06-15',
};

beforeEach(async () => {
    await Store.deleteMany({});
})

const auth = "dGVzdEBrb2liYW54LmNvbTp0ZXN0MTIz"

describe('Tests for auth', () => {

    it('Auth missing, should not connect', () => {
        return supertest(app)
            .get('/api/stores')
            .then(function (response) {
                assert.equal(response.status, 400);
            })
    });

    it('Correct auth, should GET', () => {
        return supertest(app)
            .get('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .then(function (response) {
                assert.equal(response.status, 200);
            })
    });

    it('Correct auth, should POST', () => {
        return supertest(app)
            .post('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .send(store)
            .then(function (response) {
                assert.equal(response.status, 201)
            });
    });
});


describe('Tests for missing inputs', () => {

    it('Missing concept, shouldnt POST', () => {
        return supertest(app)
            .post('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .send({
                name: 'Test Store',
                cuit: '123456',
                concepts: [1, 2, 3, 4, 5],
                currentBalance: 123,
                active: true,
                lastSale: '2022-06-15',
            })
            .then(function (response) {
                assert.equal(response.status, 400)
            });
    });

    it('Missing name, shouldnt POST', () => {
        return supertest(app)
            .post('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .send({
                cuit: '123456',
                concepts: [1, 2, 3, 4, 5, 6],
                currentBalance: 123,
                active: true,
                lastSale: '2022-06-15',
            })
            .then(function (response) {
                assert.equal(response.status, 400)
            });
    });

    it('Name already in use, shouldnt POST', () => {
        Store.create(store);
        return supertest(app)
            .post('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .send(store)
            .then(function (response) {
                assert.equal(response.status, 400)
            });
    });
});


describe('Testing outputs', () => {


    it('Checking name after insertion', () => {
        return supertest(app)
            .post('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .send(store)
            .then(function (response) {
                assert.equal(response.body.name, "Test Store")
            });
    });

    it('Checking number of stores after GET', () => {
        for (let i = 0; i < 20; i++) {

            const store = {
                "name": "Test" + i,
                "cuit": "1995743 -" + Math.round(Math.random() * 10),
                "concepts": [Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10)],
                "currentBalance": Math.random() * 10000,
                "active": Boolean(Math.round(Math.random())),
                "lastSale": "2022-06-14T06:17:09Z"
            }
            Store.create(store);
        }
        return supertest(app)
            .get('/api/stores')
            .set('Authorization', `Basic ${auth}`)
            .then(function (response) {
                assert.equal(response.body.total, 20);
            })
    });

    it('Checking pages of GET', () => {
        for (let i = 0; i < 20; i++) {

            const store = {
                "name": "Test" + i,
                "cuit": "1995743 -" + Math.round(Math.random() * 10),
                "concepts": [Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10), Math.round(Math.random() * 10)],
                "currentBalance": Math.random() * 10000,
                "active": Boolean(Math.round(Math.random())),
                "lastSale": "2022-06-14T06:17:09Z"
            }
            Store.create(store);
        }
        return supertest(app)
            .get('/api/stores?limit=10')
            .set('Authorization', `Basic ${auth}`)
            .then(function (response) {
                assert.equal(response.body.pages, 2);
            })
    });

});