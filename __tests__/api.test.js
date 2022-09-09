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
        test('404: should return an error when given a category that does not exist', () => {
            return request(app)
                .get('/api/reviews?category=banana')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Category doesn\'t exist');

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
        test('200: should return a sorted array of all the reviews sorted by date ASC when given a order query', () => {
            return request(app)
                .get('/api/reviews?order=ASC')
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body
                    expect(reviews).toBeInstanceOf(Array)
                    expect(reviews).toHaveLength(13)
                    expect(reviews).toBeSortedBy('created_at', { ascending: true })
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
        test('200: should return a sorted array of all the reviews sorted by votes DESC when given a sort_by query', () => {
            return request(app)
                .get('/api/reviews?sort_by=votes')
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body
                    expect(reviews).toBeInstanceOf(Array)
                    expect(reviews).toHaveLength(13)
                    expect(reviews).toBeSortedBy('votes', { descending: true })
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
        test('200: should return a sorted array of all the reviews sorted by votes ASC when given a sort_by query and a order by query', () => {
            return request(app)
                .get('/api/reviews?sort_by=votes&?order=ASC')
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body
                    expect(reviews).toBeInstanceOf(Array)
                    expect(reviews).toHaveLength(13)
                    expect(reviews).toBeSortedBy('votes', { descending: true })
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

        test('200: should return a sorted array of all the reviews sorted by date DESC when given an invalid column', () => {
            return request(app)
                .get('/api/reviews?sort_by=banana')
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
        test('200: should return a sorted array of all the reviews sorted by date ASC when given a lowercase order query', () => {
            return request(app)
                .get('/api/reviews?order=asc')
                .expect(200)
                .then(({ body }) => {
                    const { reviews } = body
                    expect(reviews).toBeInstanceOf(Array)
                    expect(reviews).toHaveLength(13)
                    expect(reviews).toBeSortedBy('created_at', { ascending: true })
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
        test('400: should return a error when given a review_id that does not exist', () => {
            return request(app)
                .get('/api/reviews/banana')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid review ID');

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
        test('400 :should return an error when given a invalid review ID', () => {
            return request(app)
                .get('/api/reviews/banana/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID is invalid');

                });
        });
        test('404 :should return an error when given a review id that does not exist', () => {
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
});
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
        test('400: should return a error when given a review_id that is invalid', () => {
            const voteChange = {
                inc_vote: 1
            }

            return request(app)
                .patch('/api/reviews/banana')
                .send(voteChange)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID is not valid');

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
        test('400: should return an error when given an invalid value for the votes', () => {
            const voteChange = {
                inc_vote: 'banana'
            }
            return request(app)
                .patch('/api/reviews/2')
                .send(voteChange)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid value for votes');

                });
        });
    });
})
describe('POST', () => {
    describe('POST comment by review ID', () => {
        test('201: should post a comment and return the posted comment', () => {
            const newComment = {
                username: 'bainesface',
                body: 'What and amazing game'
            }
            return request(app)
                .post('/api/reviews/1/comments')
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.comment).toEqual({
                        votes: 0,
                        review_id: 1,
                        created_at: expect.any(String),
                        author: 'bainesface',
                        body: 'What and amazing game',
                        comment_id: 7
                    })
                })
        });
        test('404: should return a error when given a review_id that does not exist', () => {
            const newComment = {
                username: 'bainesface',
                body: 'What and amazing game'
            }
            return request(app)
                .post('/api/reviews/100/comments')
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID does not exist');

                });
        });
        test('400: should return a error when given a review_id that is not a valid data type', () => {
            const newComment = {
                username: 'bainesface',
                body: 'What and amazing game'
            }
            return request(app)
                .post('/api/reviews/banana/comments')
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("ID is invalid");

                });
        });
        test('400: should return a error when given a body that is an invalid type', () => {
            const newComment = {
                username: 'bainesface',
                body: 400
            }
            return request(app)
                .post('/api/reviews/1/comments')
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Your comment is invalid");

                });
        });
        test('400: should return a error when given a review_id that is not a valid data type', () => {
            const newComment = {
                username: 'bainesface',
                body: ''
            }
            return request(app)
                .post('/api/reviews/1/comments')
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Your comment is invalid");

                });
        });
        test('400: should return a error when given a review_id that is not a valid data type', () => {
            const newComment = {
                username: 'bob',
                body: 'What an amazing game'
            }
            return request(app)
                .post('/api/reviews/1/comments')
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('user does not exist');

                });
        });
    });
})

describe('DELETE', () => {
    describe('DELETE comment by comment ID', () => {
        test('204: it should return only an error code when given a valid comment ID', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
        });
        test('400 : it should return an error when given an invalid comment ID', () => {
            return request(app)
                .delete('/api/comments/banana')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid comment ID')
                })
        });
        test('404 : it should return an error when given a comment ID that does not exist', () => {
            return request(app)
                .delete('/api/comments/6000000')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('ID does not exist')
                })
        });
    });
});

describe('Error handling', () => {
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
});