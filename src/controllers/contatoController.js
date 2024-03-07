const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato',{
        contatoId: {}
      })
}

exports.register = async (req, res) => {
    try {


        //  console.log(req.body)
        const contato = new Contato(req.body);

        await contato.register();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }


        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

exports.editIndex = async (req, res) => {
    // console.log(req.params.id)
    try {
        if (!req.params.id) return res.render('404');

        const contato = new Contato();
        const contatoId = await contato.findId(req.params.id);
        if (!contatoId) return res.render('404');
        //console.log(contatoId.nome)
        res.render('contato', {
            contatoId
        })

    } catch (error) {
        console.log(error)
    }
}

exports.editContact = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        const contatoUp = await contato.edit(req.params.id);
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }

        req.flash('success', 'Contato editador com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    } catch (error) {
        console.log(error);
        res.render('404')
    }
}

exports.delete = async (req,res) => {
    try {
        if (!req.params.id) return res.render('404');

        const contato = new Contato();
        const contatoId = await contato.delete(req.params.id);
        //console.log(contatoId.nome)
        req.flash('success', 'Deletado com sucesso!');
        req.session.save(() => res.redirect('/'));
        return;

    } catch (error) {
        console.log(error)
    }
}