const express = require('express')
const { getCategories } = require('./Controllers/Get-Categories');
const { getReviews } = require('./Controllers/Get-reviews');
const { getUsers } = require('./Controllers/Get-users');
const { patchReviews } = require('./Controllers/Patch-reviews');


const app = express();

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviews)

app.get('/api/users', getUsers)

app.patch('/api/reviews/:review_id', patchReviews)

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