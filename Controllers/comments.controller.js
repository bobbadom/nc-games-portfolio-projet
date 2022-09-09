const { removeCommentsByID } = require("../Models/comments-model")



exports.deleteCommentByID = ((req, res, next) => {
    const commentID = req.params.comment_id
    removeCommentsByID().then((results) => {
        res.status(204).send()
    })
})