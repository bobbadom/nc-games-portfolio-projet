
const { selectReviewByID, updateReviewsVotes, selectReviews, selectCommentsByReviewID, insertReviewByID } = require("../Models/reviews-model")


exports.getReviewsByID = ((req, res, next) => {
    const reviewID = req.params.review_id
    selectReviewByID(reviewID).then((review) => {
        res.status(200).send(review)
    })
        .catch((err) => {
            next(err);
        });
})


exports.patchReviewsByID = ((req, res, next) => {
    const reviewID = req.params.review_id
    const voteChange = req.body.inc_vote

    updateReviewsVotes(reviewID, voteChange).then((review) => {
        res.status(200).send({ review })
    })
        .catch((err) => {
            next(err);
        });
})

exports.getReviews = ((req, res, next) => {
    const category = req.query.category
    const order = req.query.order
    const sortBy = req.query.sort_by
    selectReviews(category, order, sortBy).then((reviews) => {
        res.status(200).send({ reviews })
    })
        .catch((err) => {
            next(err);
        });
})



exports.getCommentsByReviewID = ((req, res, next) => {
    const reviewID = req.params.review_id
    selectCommentsByReviewID(reviewID).then((comments) => {
        res.status(200).send({ comments })

    })
        .catch((err) => {
            next(err);
        });
})

exports.postReviewsByID = ((req, res, next) => {
    const newComment = req.body
    const reviewID = req.params.review_id
    insertReviewByID(newComment, reviewID).then((comment) => {
        res.status(201).send({ comment })
    })
        .catch((err) => {
            next(err);
        });
})


