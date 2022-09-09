const db = require('../db/connection')


exports.removeCommentsByID = ((commentID) => {
    commentID = parseInt(commentID)

    if (Number.isNaN(commentID) === true) { return Promise.reject({ status: 400, msg: 'Invalid comment ID' }) }


    return db.query('DELETE FROM comments WHERE comment_id=$1 RETURNING *', [commentID]).then((results) => {
        if (results.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'ID does not exist' });
        }
    })
})