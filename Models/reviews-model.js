const db = require('../db/connection')

exports.selectReviewByID = (reviewID) => {
    reviewID = parseInt(reviewID)
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 404, msg: 'Path not found' }) }

    return db.query(`SELECT COUNT(*) FROM comments WHERE review_id=$1`, [reviewID]).then((result) => {
        const commentCounter = result.rows[0].count
        return db.query(`ALTER TABLE reviews 
        ADD comment_count INT;
        UPDATE reviews
        SET comment_count=${commentCounter} 
        WHERE review_id=${reviewID} RETURNING *;
        `)
            .then((results) => {
                if (results[1].rows.length === 0) {
                    return Promise.reject({ status: 404, msg: 'ID does not exist' });
                }
                return results[1].rows[0]
            })
    })
}

exports.updateReviewsVotes = (reviewID, voteChange) => {
    reviewID = parseInt(reviewID)
    voteChange = parseInt(voteChange)

    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 404, msg: 'ID does not exist' }) }

    if (Number.isNaN(voteChange) === true) { return Promise.reject({ status: 400, msg: 'Bad request' }) }
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING *;`, [voteChange, reviewID]).then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'ID does not exist' });
        }
        return results.rows[0]
    })

}

exports.selectReviews = (category) => {
    return db.query(`SELECT slug FROM categories`).then((result) => {
        let slugArr = result.rows
        const categoryCheckerArr = slugArr.map((item) => {
            return item.slug
        })
        let categoryCheckerValidator = false

        categoryCheckerArr.forEach((checkedCategory) => {
            if (category === checkedCategory) {
                categoryCheckerValidator = true
            }
        })


        let queryStr = `SELECT 
     reviews.review_id, 
     reviews.category, 
     reviews.review_img_url, 
     reviews.created_at,
     reviews.votes,
     reviews.title,
     reviews.owner,
     reviews.designer,
     COUNT(comments.review_id)::INT AS comment_count FROM reviews
     LEFT JOIN comments ON reviews.review_id = comments.review_id`

        const categoryArr = []

        if (category) {
            categoryArr.push(category)
            queryStr += ` WHERE reviews.category=$1 `
        }
        queryStr += ` GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;`
        return db.query(queryStr, categoryArr).then((results) => {

            if (results.rows.length === 0 && categoryCheckerValidator === false) {
                return Promise.reject({ status: 404, msg: 'ID does not exist' });
            }
            return results.rows

        })
    })
}