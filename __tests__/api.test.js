const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const app = require('../app')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET', () => {
    describe('GET categories', () => {
        test('200: should return an array of the catagories', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({ body }) => {
                    const { categories } = body
                    expect(categories).toBeInstanceOf(Array)
                    expect(categories).toHaveLength(4)
                    categories.forEach((category) => {
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),

                        })
                    })
                })
        });
    });
});