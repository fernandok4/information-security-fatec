const express = require('express')
const body_parser = require('body-parser')
const account = require('./src/account/account')
const app = express()

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

app.post('/cadastrar', (req, res) => {
    console.log(req.body)
    console.log("teste")
    params = ["cd_username", "cd_email", "nm_user"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.insertNewUser(req.body, isWorking => {
        if(isWorking == 1){
            res.send("cadastrado!")
        }
        if(isWorking == 2){
            res.send("Usuario ja existe!")
        }
        if(isWorking == 3){
            res.send("Erro!")
        }
    })  
    return
})

app.post('/password-recover', (req, res) => {
    params = ["cd_username"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.recoverPassword(req.body)
})

app.post('/verify', (req, res) => {
    params = ["cd_username", "ds_token"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.loginUser(req.body, (cd_status) => {
        if(cd_status == "WRONG_PASSWORD"){
            res.send("WRONG_PASSWORD")
        }
        if(cd_status == "SUCCESS"){
            res.send("SUCCESS")
        }
        if(cd_status == "NOT_FOUND"){
            res.send("USER_NOT_FOUND")
        }
    })
})

app.post('/change-password', (req, res) => {
    params = ["cd_username", "ds_password1", "ds_password2"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    if(req.body.ds_password1 == req.body.ds_password2){
        account.updatePassword(req.body)
        res.send("mudado")
    }
})

app.post('/login', (req, res) => {
    params = ["cd_username", "ds_password"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.loginUser(req.body, (cd_status) => {
        if(cd_status == undefined){
            res.send("USER_NOT_FOUND")
        }
        if(cd_status == "WRONG_PASSWORD"){
            res.send("WRONG_PASSWORD")
        }
        if(cd_status == "SUCCESS"){
            account.isFirstTime(req.body, is_first_time => {
                if(!is_first_time){
                    res.send("VERIFY")
                } else {
                    res.send("SUCCESS")
                }
            })
        }
        if(cd_status == "NOT_FOUND"){
            res.send("USER_NOT_FOUND")
        }
    })
    return
})

app.listen(3000, () => console.log("O servidor está rodando na porta 3000"))

function verifyBodyRequest(body, params){
    for(i in params){
        if(body[params[i]] == undefined){
            return false
        }
    }
    return true
}