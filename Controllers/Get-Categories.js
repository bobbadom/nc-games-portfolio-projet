const { getCategoriesModel } = require("../Models/Get-categories-model")


exports.getCategories = (req, res, next) => {
    getCategoriesModel().then((categories) => {
        res.status(200).send({ categories })
    })
}