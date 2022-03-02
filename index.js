// let fs = require('fs');
let express = require('express');
let session = require('express-session');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let path = require('path');
let morgan = require('morgan')
let serverRoutes = require("./routes");
let cors = require('cors')
require('./passport/local-auth');

let app = express();
let PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors('*'))
app.use(express.static(path.join(__dirname,"public")));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('un secreto'));
app.use(session ({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    // store: sessionStore,
    cookie: {
        maxAge: 60 * 10 * 1000 // Equals 10 min. 
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "ejs");

app.get('/', (req, res) => res.redirect('/api/index'))

app.get('/:params', (req, res) => {
        let object = {
            error: -2,
            descripcion: `Ruta '/${req.params.params}' por metodo ${req.method} no implementada`
            }
        res.send(object)
});

serverRoutes(app);

app.listen(PORT, () => {
    console.log(`Server funcionando en http://localhost:${PORT}`);
})

