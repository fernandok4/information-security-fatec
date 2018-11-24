const express = require('express')
const body_parser = require('body-parser')
const account = require('./src/account/account')
const app = express()

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

app.post('/cadastrar', (req, res) => {
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

app.post('/verify', (req, res) => {
    params = ["cd_username", "ds_token"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.loginUser(req.body, () => {
        if(cd_status == "WRONG_PASSWORD"){
            res.send("SENHA ERRADA")
        }
        if(cd_status == "SUCCESS"){
            res.send("Logado")
        }
        if(cd_status == "NOT_FOUND"){
            res.send("USUARIO NÃO ENCONTRADO")
        }
    })
})

app.post('/change-password', (req, res) => {
    params = ["cd_username", "ds_password1", "ds_password2"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.updatePassword(req.body)
})

app.post('/login', (req, res) => {
    params = ["cd_username", "ds_password"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Faltando Parametro")
        return
    }
    account.loginUser(req.body, (cd_status) => {
        if(cd_status == undefined){
            res.send("USUARIO NÃO ENCONTRADO")
        }
        if(cd_status == "WRONG_PASSWORD"){
            res.send("SENHA ERRADA")
        }
        if(cd_status == "SUCCESS"){
            account.isFirstTime(req.body, is_first_time => {
                if(!is_first_time){
                    res.send("Verificar")
                } else {
                    res.send("Logado")
                }
            })
        }
        if(cd_status == "NOT_FOUND"){
            res.send("USUARIO NÃO ENCONTRADO")
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