const { selectReviewByID, updateReviewsVotes, selectReviews } = require("../Models/reviews-model")

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
    selectReviews().then((reviews) => {
        res.status(200).send({ reviews })
    })
})