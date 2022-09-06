const db = require('../db/connection')

exports.patchReviewsModel = (reviewID, voteChange) => {
    reviewID = parseInt(reviewID)
    voteChange = parseInt(voteChange)

    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 404, msg: 'ID does not exist' }) }

    if (Number.isNaN(voteChange) === true) { return Promise.reject({ status: 400, msg: 'Bad request' }) }
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING *;`, [voteChange, reviewID]).then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 400, msg: 'ID does not exist' });
        }
        return results.rows[0]
    })

}