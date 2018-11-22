const mysql = require('mysql')
const json = require('../../db-config.json')
const crypto = require('crypto')
const conn = mysql.createConnection(json)

function insertNewUser(user){
    let sql = `INSERT INTO tb_user(cd_username, ds_password, cd_email, 
        nm_user, is_verified) VALUES (?, ?, ?, ?, FALSE)`
    let hash = crypto.createHash('sha512')
    let password = hash.update(user.ds_password, 'utf-8')
    conn.query(sql, [user.cd_username, password.digest('base64'), 
        user.cd_email, user.nm_user], (err, rows, fields) => {
            if(err){
                console.log(err)
            } else {
                console.log('deu certo')
            }
        })
}

function createNewUser(user){
    if(user.ds_password == user.ds_password2){
        insertNewUser(user)
    }
}

function loginUser(login, callback){
    let hash = crypto.createHash('sha512')
    let password = hash.update(login.ds_password, 'utf-8')
    let sql = `SELECT ds_password = ? as cd_status FROM tb_user WHERE cd_username = ? LIMIT 1`
    var cd_status = "DEFAULT_RESULT"
    conn.query(sql, [password.digest('base64'), login.cd_username], (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            if(result[0] == undefined){
                cd_status = 'NOT_FOUND'
                callback(cd_status)
            } 
            if(result[0].cd_status == 0){
                cd_status = 'WRONG_PASSWORD'
                callback(cd_status)
            }
            if(result[0].cd_status == 1){
                cd_status = 'SUCCESS'
                callback(cd_status)
            }
        }
    })
}

function getUserInformation(login, callback){
    let hash = crypto.createHash('sha512')
    let password = hash.update(login.ds_password, 'utf-8')
    let sql = `SELECT ds_password = ? as cd_status FROM tb_user WHERE cd_username = ? LIMIT 1`
    var cd_status = "DEFAULT_RESULT"
    conn.query(sql, [password.digest('base64'), login.cd_username], (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            if(result[0] == undefined){
                cd_status = 'NOT_FOUND'
                callback(cd_status)
            } 
            if(result[0].cd_status == 0){
                cd_status = 'WRONG_PASSWORD'
                callback(cd_status)
            }
            if(result[0].cd_status == 1){
                cd_status = 'SUCCESS'
                callback(cd_status)
            }
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    loginUser: loginUser
}