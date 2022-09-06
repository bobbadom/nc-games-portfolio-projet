const { patchReviewsModel } = require("../Models/patch-reviews-model")


exports.patchReviews = ((req, res, next) => {
    const reviewID = req.params.review_id
    const voteChange = req.body.inc_vote

    patchReviewsModel(reviewID, voteChange).then((review) => {
        res.status(200).send({ review })
    })
        .catch((err) => {
            next(err);
        });
})