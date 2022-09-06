const { getUsersModel } = require("../Models/Get-users-model")

exports.getUsers = (req, res, next) => {
    getUsersModel().then((users) => {
        res.status(200).send({ users })
    })
}