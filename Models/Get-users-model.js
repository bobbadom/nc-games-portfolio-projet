const db = require('../db/connection')

exports.getUsersModel = () => {
    return db.query('SELECT * FROM users;').then((result) => {
        return result.rows
    })
}