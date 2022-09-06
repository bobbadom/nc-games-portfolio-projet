const db = require('../db/connection')

exports.patchReviewsModel = (reviewID, voteChange) => {
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING*;`, [voteChange, reviewID])

}