require("dotenv").config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.CONNECTION_STR).then(() => {
  app.emit('conectado')
  console.log("Banco de dados conectado com sucesso!.. Iniciando app")
}).catch(err => {
  console.log(err)
})

const Session = require("express-session");
const MemoryStore = require('memorystore')(Session);
const flash = require('express-flash');


const PORT = process.env.PORT || 3001;
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checksCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');


app.use(helmet())

// Habilitar o middleware cors para todas as rotas
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = Session({
  secret: "kkkkkaaaaaaaaaa",
  store: new MemoryStore({
    checkPeriod: 86400000 // Tempo em milissegundos para verificar a expiração das sessões
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true
  }
})


app.use(sessionOptions);
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf())

app.use(middlewareGlobal);
app.use(checksCsrfError)
app.use(csrfMiddleware)
app.use(routes);


app.on('conectado', () => {
  app.listen(PORT, () => {
    console.log('Servidor Iniciado com sucesso');
    console.log('Acessar http://localhost:3000')
  })
})



module.exports = app;


