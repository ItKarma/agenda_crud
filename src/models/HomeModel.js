const mongoose = require('mongoose');

const HomeSchemma = new mongoose.Schema({
    titulo: { type :String , required: true}
})

const HomeModel = mongoose.model('Home', HomeSchemma);

//module.exports = HomeModel