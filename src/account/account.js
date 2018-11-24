const mysql = require('mysql')
const json_db = require('../../db-config.json')
const json_email = require('../../email-config.json')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const conn = mysql.createConnection(json_db)

function insertNewUser(user, callback){
    let sql = `INSERT INTO tb_user(cd_username, ds_password, cd_email, 
        nm_user, is_verified) VALUES (?, ?, ?, ?, FALSE)`
    let isWorking = 3;
    user.ds_password = createRandomPassword()
    let hash = crypto.createHash('sha512')
    let password = hash.update(user.ds_password, 'utf-8')
    conn.query(sql, [user.cd_username, password.digest('base64'), 
        user.cd_email, user.nm_user], (err, rows, fields) => {
            if(err){
                if(err.sqlState == 23000){
                    isWorking = 2
                } 
            } else {
                console.log('deu certo')
                isWorking = 1
            }
            sendEmail(user.cd_email, user.ds_password)
            callback(isWorking)
        })
}

function loginUser(login, callback){
    let hash = crypto.createHash('sha512')
    let password = hash.update(login.ds_token, 'utf-8')
    let sql = `SELECT ds_password = ? as cd_status FROM tb_user WHERE cd_username = ? LIMIT 1`
    var cd_status = "DEFAULT_RESULT"
    conn.query(sql, [password.digest('base64'), login.cd_username], (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            if(result == undefined || result.length == 0){
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

function isFirstTime(login, callback){
    let sql = `SELECT is_verified FROM tb_user WHERE cd_username = ? LIMIT 1`
    conn.query(sql, login.cd_username, (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            callback(result[0].is_verified)
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
            if(result == undefined || result.length == 0){
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

function updateIsVerified(user, callback){
    let sql = `UPDATE tb_user SET is_verified = TRUE WHERE cd_username = ?`
    conn.query(sql, [user.cd_username], (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            console.log("updated")
        }
    })
}

function updatePassword(user, callback){
    let sql = `UPDATE tb_user SET password = ? WHERE cd_username = ?`
    let hash = crypto.createHash('sha512')
    let password = hash.update(user.ds_password, 'utf-8')
    conn.query(sql, [password.digest('base64'), user.cd_username], (err, result, fields) => {
        if(err){
            console.error(err)
        } else {
            console.log("updated")
        }
    })
}

function sendEmail(cd_email, password){
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: json_email
    });
    mailOptions={
        to : cd_email,
        subject : "Please confirm your Email account",
        html: `<h1>Sua senha para confirmar o email é: ${password}</h1>`
    }
    smtpTransport.sendMail(mailOptions, (error, response) => {
        if(error){
            console.log(error)
        } else {
            console.log(response)
        }
    })
}

function createRandomPassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

module.exports = {
    insertNewUser: insertNewUser,
    loginUser: loginUser,
    isFirstTime: isFirstTime,
    updateIsVerified: updateIsVerified,
    updatePassword: updatePassword
}