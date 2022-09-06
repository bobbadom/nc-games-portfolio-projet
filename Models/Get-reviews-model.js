const db = require('../db/connection')

exports.getReviewModel = (reviewID) => {
    reviewID = parseInt(reviewID)
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 404, msg: 'Path not found' }) }

    return db.query(`SELECT * FROM comments WHERE review_id=$1`, [reviewID]).then((result) => {
        const commentCounter = result.rows.length
        return db.query(`ALTER TABLE reviews 
        ADD comment_count INT;
        UPDATE reviews
        SET comment_count=${commentCounter} 
        WHERE review_id=${reviewID} RETURNING *;
        `)
            .then((results) => {
                if (results[1].rows.length === 0) {
                    return Promise.reject({ status: 400, msg: 'ID does not exist' });
                }
                return results[1].rows[0]
            })
    })
}
