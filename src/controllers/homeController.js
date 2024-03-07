const Contatos = require('../models/ContatoModel')

exports.index = async (req, res) => {

  const contatos = await new Contatos().findContacts();


  res.render('index', { contatos });
  return;
};
