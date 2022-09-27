const db = require('../db/connection')

exports.selectReviewByID = (reviewID) => {
    reviewID = parseInt(reviewID)
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 400, msg: 'Invalid review ID' }) }

    return db
        .query(`SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.review_body, reviews.category, reviews.created_at, reviews.votes, reviews.review_id, COUNT(*)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;`, [reviewID])
        .then((results) => {
            if (results.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'ID does not exist' });
            }
            return results.rows[0]
        })
}

exports.updateReviewsVotes = (reviewID, voteChange) => {
    reviewID = parseInt(reviewID)
    voteChange = parseInt(voteChange)

    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 400, msg: 'ID is not valid' }) }

    if (Number.isNaN(voteChange) === true) { return Promise.reject({ status: 400, msg: 'Invalid value for votes' }) }
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING *;`, [voteChange, reviewID]).then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'ID does not exist' });
        }
        return results.rows[0]
    })

}

exports.selectReviews = (category, order = 'DESC', sortBy = 'reviews.created_at') => {
    order = order.toUpperCase()
    return db.query(`SELECT slug FROM categories`).then((result) => {
        let slugArr = result.rows
        let columnValidator = false
        const columnArray = ['review_id', 'category', 'review_img_url', 'created_at', 'votes', 'title', 'owner', 'designer', 'comment_count']

        if (order !== 'DESC' && order !== 'ASC') {
            order = 'DESC'
        }

        columnArray.forEach((column) => {
            if (column === sortBy) {
                columnValidator = true
            }
        })
        if (columnValidator === false) {
            sortBy = 'created_at'
        }


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
          ORDER BY ${sortBy} ${order};`

        return db.query(queryStr, categoryArr).then((results) => {

            if (results.rows.length === 0 && categoryCheckerValidator === false) {
                return Promise.reject({ status: 404, msg: 'Category doesn\'t exist' });
            }
            return results.rows

        })
    })
}

exports.selectCommentsByReviewID = ((reviewID) => {
    reviewID = parseInt(reviewID)
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 400, msg: 'ID is invalid' }) }

    return db.query(`SELECT review_id FROM reviews`).then((result) => {
        let reviewIDArr = result.rows
        const reviewIDCheckerArr = reviewIDArr.map((item) => {
            return item.review_id
        })
        let reviewIDValidator = false

        reviewIDCheckerArr.forEach((checkedID) => {
            if (reviewID === checkedID) {
                reviewIDValidator = true
            }
        })

        return db.query('SELECT * FROM comments WHERE review_id=$1', [reviewID]).then((results) => {

            if (results.rows.length === 0 && reviewIDValidator === false) {
                return Promise.reject({ status: 404, msg: 'path not found' });
            }
            return results.rows
        })
    })


})

exports.insertReviewByID = ((newComment, reviewID) => {
    const { body, username } = newComment
    reviewID = parseInt(reviewID)
    if (Number.isNaN(parseInt(body)) === false || body.length === 0) { return Promise.reject({ status: 400, msg: "Your comment is invalid" }) }
    if (Number.isNaN(reviewID) === true) { return Promise.reject({ status: 400, msg: 'ID is invalid' }) }

    return db.query('SELECT username FROM users').then((res) => {
        let userArr = res.rows

        const userCheckerArr = userArr.map((item) => {
            return item.username
        })

        let reviewIDValidator = false

        userCheckerArr.forEach((checkedUser) => {
            if (username === checkedUser) {
                reviewIDValidator = true
            }
        })


        if (reviewIDValidator === false) {
            return Promise.reject({ status: 404, msg: 'user does not exist' });
        }

        return db.query(`SELECT review_id FROM reviews`).then((result) => {
            let reviewIDArr = result.rows

            const reviewIDCheckerArr = reviewIDArr.map((item) => {
                return item.review_id
            })
            let reviewIDValidator = false

            reviewIDCheckerArr.forEach((checkedID) => {
                if (reviewID === checkedID) {
                    reviewIDValidator = true
                }
            })


            if (reviewIDValidator === false) {
                return Promise.reject({ status: 404, msg: 'ID does not exist' });
            }
            return db.query(`INSERT INTO comments (body, review_id, author) 
        VALUES ($1, $2, $3)
        RETURNING * ;`, [body, reviewID, username]).then((result) => {


                return result.rows[0]
            })
        })
    })
})
