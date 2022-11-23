const { faker } = require('@faker-js/faker');

const { router } = require('./routes/productos.router.js');
const ContenedorBD = require('./model/ContenedorBD.js');
const Contenedor = require('./model/Contenedor.js');
const express = require("express");
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const bCrypt = require('bcrypt');
const mongoose = require('mongoose');
const UsuariosSchema = require('./model/usuarios.model.js');


//passport
const passport = require('passport');
const { Strategy } = require('passport-local');

const localStrategy = Strategy;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 *  Persistencia por MongoDB
 */
//const MongoStore = require('connect-mongo');
//const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };


/**
 *  Socket io conf ...
 */
const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/**
 *  Configuración para motor plantilla HBS
 */
app.engine('hbs',
    hbs({
        extname: '.hbs',
        defaultLayout: 'index.hbs'
    })
);
//const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use('/api', router);

/**
 *  Productos para faker
 */
const bdCont = new ContenedorBD('productos');
let fProductos = [];

const bdMjes = new Contenedor('centro_mensajes');
const messages = [];

/**
 *  Desafío MongoAtlas
 */
app.use(cookieParser());
app.use(session({
    /* store: MongoStore.create({
        //mongoUrl: 'mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/ecommerce',
        mongoUrl: 'mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }), */
    secret: 'Coderprueba2022',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }
}));

//middlewares passport
app.use(passport.initialize());
app.use(passport.session());

//estrategias
passport.use(
    "register",
    new localStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
            console.log("register", username + password);
            mongoose.connect(
                "mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/ecommerce"
            );

            try {
                UsuariosSchema.create(
                    {
                        username,
                        password: createHash(password),
                        direccion: req.body.direccion,
                    },
                    (err, userWithId) => {
                        if (err) {
                            console.log(err)
                            return done(err, null);
                        }
                        return done(null, userWithId);
                    }
                );
            } catch (e) {
                return done(e, null);
            }
        }
    )
);

passport.use(
    "login",
    new localStrategy((username, password, done) => {
        mongoose.connect(
            "mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/ecommerce"
        );
        try {
            UsuariosSchema.findOne(
                {
                    username,

                },
                (err, user) => {
                    if (err) {
                        return done(err, null);
                    }


                    if (!user) {
                        return done(null, false)
                    }

                    if (!isValidPassword(user, password)) {
                        return done(null, false)
                    }

                    return done(null, user)
                }
            );
        } catch (e) {
            return done(e, null);
        }
    })
);

//serializar y deserializar
passport.serializeUser((usuario, done) => {
    console.log(usuario);
    done(null, usuario._id);
});

passport.deserializeUser((id, done) => {
    UsuariosSchema.findById(id, done);
});

//
function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
    return bCrypt.compareSync(password, user.password);
}

const server = httpServer.listen(8080, () => console.log("Servidor levantado en el puerto " + server.address().port));
server.on("error", (e) => console.log(`hubo un error ${e}`));

/**
 *  Render index
 */
app.get("/", (req, res) => {
    res.render("login");
});

app.post(
    "/login",
    passport.authenticate("login", {
        successRedirect: "/home",
        failureRedirect: "/login-error",
    })
);

app.get("/login-error", (req, res) => {
    res.render("login-error");
});

app.get("/registrar", (req, res) => {
    res.render("register");
});

app.get("/datos", (req, res) => {
    res.json({ mensaje: 'sesion iniciada' });
});

app.post(
    "/registrar",
    passport.authenticate("register", {
        successRedirect: "/",
        failureRedirect: "/login-error",
    })
);

app.get("/listado", async (req, res) => {
    try {
        const eProductos = await bdCont.getAll();
        res.render("listado", {
            productos: eProductos,
            contenido: eProductos.length
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.get("/index", async (req, res) => {
    try {
        res.render('index');
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 *  0. GET '/api/productos-test' -> una lista con 5 productos (faker)
 */
app.get("/productos-test", async (req, res) => {
    try {
        const cantidadDatos = req.query.cant || 5;
        for (let i = 0; i < cantidadDatos; i++) {
            fProductos.push(generarRandomObj());
        }

        res.render("productos-test", {
            productos: fProductos,
            contenido: fProductos.length
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.get("/home", urlencodedParser, (req, res) => {
    const name = req.user.username;
    req.user.username = name;
    console.log(req.user.username)
    return res.render("index", {
        username: req.user.username
    });
});

/*app.get("/logout", (req, res) => {
    passport.
     const nombre = req.session.nombre;
    console.log(nombre);
    if (nombre) {
        req.session.destroy(e => {
            if (!e) {
                res.render("logout", { nombre });
            } else {
                res.redirect('/');
            }
        });
    } 
});*/

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});



io.on('connection', async (socket) => {
    try {
        const eProductos = await bdCont.getAll();
        console.log('Nuevo cliente conectado..')
        /**
         *  Productos
         */
        socket.emit('productos', eProductos);

        socket.on('new-prod', async (data) => {
            const p = await bdCont.save(data);
            eProductos.push(data);
            io.sockets.emit('productos', eProductos);
        });

        /**
         *  Mensajes
         */
        socket.emit('mensajes', messages);
        socket.on("new-message", async (data) => {
            //console.log(data);
            messages.push(data);

            await bdMjes.save(data);
            io.sockets.emit("messages", messages);
        });
    } catch (e) {
        throw new Error(e.message);
    }
});


/**
 *  Funciones para faker
 */
function generarRandomObj() {
    return {
        title: faker.commerce.product(),
        price: faker.commerce.price(100, 1220, 0, '$'),
        thumbnail: faker.image.image()
    }
};
