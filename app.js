const express = require('express')
const cors = require('cors')
const { getCategories } = require('./Controllers/categories-controller');
const { deleteCommentByID } = require('./Controllers/comments.controller');

const { getReviewsByID, patchReviewsByID, getReviews, postReviewsByID, getCommentsByReviewID } = require('./Controllers/reviews-controller');

const { getUsers } = require('./Controllers/users-controllers');


const app = express();

app.use(cors())

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewsByID)

app.get('/api/users', getUsers)

app.patch('/api/reviews/:review_id', patchReviewsByID)

app.get('/api/reviews', getReviews)

app.post('/api/reviews/:review_id/comments', postReviewsByID)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.delete('/api/comments/:comment_id', deleteCommentByID)


app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Path not found' })
})

app.use((err, req, res, next) => {
    if (err.status && err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
})

module.exports = app;