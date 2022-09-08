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
                        expect(category).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String),

                            })
                        );
                    });
                })
        })
    });
});
describe('GET reviews', () => {
    test('200: should return an array of all the reviews', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews).toHaveLength(13)
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            category: expect.any(String),
                            comment_count: expect.any(Number),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            created_at: expect.any(String),
                            review_img_url: expect.any(String),
                            review_id: expect.any(Number),
                            title: expect.any(String),
                            votes: expect.any(Number)
                        })
                    )
                })
            })
    });
    test('200: should return a sorted array of all the reviews sorted by date DESC', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews).toHaveLength(13)
                expect(reviews).toBeSortedBy('created_at', { descending: true })
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            category: expect.any(String),
                            comment_count: expect.any(Number),
                            designer: expect.any(String),
                            owner: expect.any(String),
                            created_at: expect.any(String),
                            review_img_url: expect.any(String),
                            review_id: expect.any(Number),
                            title: expect.any(String),
                            votes: expect.any(Number)
                        })
                    )
                })
            })
    });
    test('200: should filter the reviews when given a category', () => {
        return request(app)
            .get('/api/reviews?category=dexterity')
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body
                expect(reviews).toBeInstanceOf(Array)
                expect(reviews).toHaveLength(1)
                expect(reviews).toEqual([{ "category": "dexterity", "comment_count": 3, "created_at": "2021-01-18T10:01:41.251Z", "designer": "Leslie Scott", "owner": "philippaclaire9", "review_id": 2, "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png", "title": "Jenga", "votes": 5 }])
            })
    });
    test('400: should return an error when given a category that does not exist', () => {
        return request(app)
            .get('/api/reviews?category=banana')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('ID is invalid');

            });

    })
    test('200: should return an empty array when given a category that does exist but has no reviews', () => {
        return request(app)
            .get('/api/reviews?category=children\'s+games')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toEqual([]);

            });

    })

})
describe('GET review by id', () => {
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
                    votes: 5,
                    comment_count: 3
                })
            })
    })
    test('404: should return a error when given a review_id that does not exist', () => {
        return request(app)
            .get('/api/reviews/100')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('ID does not exist');

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
describe('GET users', () => {
    test('200: should return an array of the users', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                const { users } = body
                expect(users).toBeInstanceOf(Array)
                expect(users).toHaveLength(4)
                users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)

                        }))
                })
            })
    });
});
describe('GET comment by review Id', () => {
    test('200 :should return an array of comments when given a review ID', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toHaveLength(3)
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            review_id: expect.any(Number)

                        }))
                })
            })
    });
    test('400 :should return an error when given ', () => {
        return request(app)
            .get('/api/reviews/banana/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('ID is invalid');

            });
    });
    test('404 :should return an error when given ', () => {
        return request(app)
            .get('/api/reviews/600000/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('path not found');

            });
    });
    test('200: should return an empty array when given a valid review ID but has no comments', () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);

            });
    });
})

describe('PATCH', () => {
    describe('PATCH reviews', () => {
        test('200: should increment the votes by the by the amount requested', () => {
            const voteChange = {
                inc_vote: 100
            }
            return request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send(voteChange)
                .then(({ body }) => {
                    expect(body.review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        category: 'dexterity',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_body: 'Fiddly fun for all the family',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 105
                    })
                })
        });
        test('200: should decrement the votes by the by the amount requested', () => {
            const voteChange = {
                inc_vote: -4
            }
            return request(app)
                .patch('/api/reviews/2')
                .expect(200)
                .send(voteChange)
                .then(({ body }) => {
                    expect(body.review).toEqual({
                        review_id: 2,
                        title: 'Jenga',
                        category: 'dexterity',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_body: 'Fiddly fun for all the family',
                        review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 1
                    })
                })
        });
        test('404: should return a error when given a review_id that is invalid', () => {
            const voteChange = {
                inc_vote: 1
            }

            return request(app)
                .patch('/api/reviews/banana')
                .send(voteChange)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID does not exist');

                });
        });
        test('404: should return a error when given a review_id that does not exist', () => {
            const voteChange = {
                inc_vote: 1
            }
            return request(app)
                .patch('/api/reviews/7000')
                .send(voteChange)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID does not exist');

                });
        });
        test('404: should return an error when given an invalid value for the votes', () => {
            const voteChange = {
                inc_vote: 'banana'
            }
            return request(app)
                .patch('/api/reviews/2')
                .send(voteChange)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request');

                });
        });
    });
})