const { getReviewModel } = require("../Models/Get-reviews-model")

exports.getReviews = ((req, res, next) => {
    const reviewID = req.params.review_id
    getReviewModel(reviewID).then((review) => {
        res.status(200).send(review)
    })
        .catch((err) => {
            next(err);
        });
}) 