const db = require('../db/connection')

exports.getCategoriesModel = () => {
    return db.query('SELECT * FROM categories').then((result) => {
        return result.rows
    })
}