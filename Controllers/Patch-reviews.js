const { patchReviewsModel } = require("../Models/Patch-reviews-model")


exports.patchReviews = ((req, res, next) => {
    const reviewID = req.params.review_id
    const voteChange = req.body.vote

    patchReviewsModel(reviewID, voteChange).then((review) => {
        res.status(200).send(review.rows[0])
    })
        .catch((err) => {
            next(err);
        });
})