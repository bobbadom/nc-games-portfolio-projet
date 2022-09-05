const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')
const app = require('../app')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET', () => {
    describe('checking wrong paths', () => {
        test('404: should return error when given a invalid path', () => {
            return request(app)
                .get('/api/banana')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Path not found');

                });
        });
    });
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
    describe('GET reviews', () => {
        test('200: should return an array of the catagories', () => {
            return request(app)
                .get('/api/reviews/2')
                .expect(200)
                .then(({ body }) => {
                    const review = body
                    expect(review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        category: 'dexterity',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_body: 'Fiddly fun for all the family',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 5
                    })
                })
        })
        test('404: should return a error when given a review_id that does not exist', () => {
            return request(app)
                .get('/api/reviews/100')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Path not found');

                });
        });
        test('404: should return a error when given a review_id that does not exist', () => {
            return request(app)
                .get('/api/reviews/banana')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Path not found');

                });
        });
    })
})