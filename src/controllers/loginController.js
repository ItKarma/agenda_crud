const Login = require('../models/loginModel');


exports.index = (req, res) => {
    if(req.session.user) return res.render('logado')
    res.render('login')
}

exports.register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register()
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            console.log(login.errors)
            req.session.save(function () {
                return res.redirect('back');
            })

            return;
        }
        req.flash('success', 'Usuario criado com sucesso!');
        req.session.save(function () {
            return res.redirect('back');
        });
    } catch (error) {
        console.log(error)
        res.render('404');
    }
}

exports.login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login()
        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            console.log(login.errors)
            req.session.save(function () {
                return res.redirect('back');
            })

            return;
        }
        req.flash('success', 'Logado com sucesso');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('back');
        });
    } catch (error) {
        console.log(error)
        res.render('404');
    }
}

exports.logout =  (req, res) => {
    req.session.destroy();
    res.redirect('/login/index')
}