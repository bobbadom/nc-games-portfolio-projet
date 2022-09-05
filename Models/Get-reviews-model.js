const db = require('../db/connection')

exports.getReviewModel = (reviewID) => {
    return db.query('SELECT * FROM reviews WHERE review_id=$1 ', [reviewID])
        .then((results) => {
            if (results.rows.length === 0) {
                return Promise.reject({ status: 400, msg: 'Invalid key' });
            }
            return results.rows[0]
        })
}
