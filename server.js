const express = require('express')
const body_parser = require('body-parser')
const account = require('./src/account/account')
const app = express()

app.use(body_parser.urlencoded({extended: true}))
app.use(body_parser.json())

app.post('/cadastrar', (req, res) => {
    params = ["cd_username", "ds_password", "ds_password2", "cd_email", "nm_user"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Erro")
        return
    }
    if(req.body.ds_password == req.body.ds_password2){
        account.createNewUser(req.body)
        res.send("cadastrado!")
        return
    }
    res.send("Errooo")
})

app.post('/login', (req, res) => {
    params = ["cd_username", "ds_password"]
    if(!verifyBodyRequest(req.body, params)){
        res.send("Erro")
        return
    }
    let cd_status = account.loginUser(req.body, (cd_status) => {
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

app.listen(3000, () => console.log("O servidor está rodando na porta 3000"))

function verifyBodyRequest(body, params){
    for(i in params){
        if(body[params[i]] == undefined){
            return false
        }
    }
    return true
}