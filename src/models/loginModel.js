const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchemma = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchemma);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;

    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) return this.errors.push('Usuario nao existe');
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha Invalida!');
            return
        }
    }

    async register() {
        this.valida();
        await this.userExists()

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        const user = await LoginModel.findOne({ email: this.body.email });
        if (user) this.errors.push('Usuario ja Existe!');
    }

    valida() {
        this.cleanUp();
        //validaçao de dados
        if (!validator.isEmail(this.body.email)) this.errors.push('Email invalido!');

        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres')
        }

    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        }

        console.log(this.body)

    }
}

module.exports = Login