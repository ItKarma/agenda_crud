const mongoose = require('mongoose');
const Validador = require('validator');

const contatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now }
})

const ContatoModel = mongoose.model('Contato', contatoSchema);

class Contato {
    /**
     * 
     * @param { {} } body body com os dados para cadastro de contato , nome, email, telefone
     */
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null

    }

    async register() {
        this.valida();

        if (this.errors.length > 0) return;

        this.contato = await ContatoModel.create(this.body)
    }
    /**
     * 
     * @param {string} id // Id unico do mongodb
     */
    async findId(id) {
        const user = await ContatoModel.findById(id);
        return user
    }

    async findContacts() {
        const contatos = await ContatoModel.find()
            .sort({ criadosEm: -1 })
        return contatos
    }

    /**
* 
* @param {string} id // Id unico do mongodb
*/

    async edit(id) {
        if (typeof id == 'string') {
            this.valida();
            if (this.errors.length > 0) return;
            this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })

        }
    }

    /**
 * 
 * @param {string} id // Id unico do mongodb
 */
    async delete(id) {
        if (typeof id == 'string') {
            if (this.errors.length > 0) return;
            this.contato = await ContatoModel.findOneAndDelete({ _id: id });
            return;

        }
    }

    valida() {
        this.cleanUp();
        //validaçao de dados
        if (!this.body.nome || !this.body.email || !this.body.telefone) return this.errors.push('Todos os campos sao Obrigatorios')
        if (!Validador.isEmail(this.body.email)) this.errors.push('Email invalido!');
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            email: this.body.email,
            telefone: this.body.telefone,
        }
    }
}

module.exports = Contato