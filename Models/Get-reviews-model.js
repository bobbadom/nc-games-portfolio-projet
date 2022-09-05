const db = require('../db/connection')

exports.getReviewModel = (reviewID) => {
    reviewID = parseInt(reviewID)
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 404, msg: 'Path not found' }) }


    return db.query('SELECT * FROM reviews WHERE review_id=$1;', [reviewID])
        .then((results) => {
            if (results.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Path not found' });
            }
            return results.rows[0]
        })
}
