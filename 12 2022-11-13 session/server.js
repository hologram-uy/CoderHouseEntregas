/**
 *  Entrega nro. 7
 */
const { faker } = require('@faker-js/faker');
const { normalize, denormalize, schema } = require('normalizr');
const util = require('node:util');

const { router } = require('./routes/productos.router.js');
const ContenedorBD = require('./model/ContenedorBD.js');
const MensajesBD = require('./model/MensajesBD.js');
const Contenedor = require('./model/Contenedor.js');
const express = require("express");
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();


/**
 *  Persistencia por MongoDB
 */
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };


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
const jsonParser = bodyParser.json();
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

/**
 *  Schema normalización mensajes
 */
//const bdMjes = new MensajesBD();
const bdMjes = new Contenedor('centro_mensajes');
const messages = [];

/* const authorSchema = new schema.Entity('author', {}, { idAttribute: 'id' });
//const messagesSchema = new schema.Entity('messages', { idAttribute: 'id' });

const chatSchema = new schema.Entity("chatSchema", {
    author: authorSchema
});
 */

/**
 *  Desafío MongoAtlas
 */
app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        //mongoUrl: 'mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/ecommerce',
        mongoUrl: 'mongodb+srv://hologram:Coderprueba2022@cluster0.iay9oij.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'Coderprueba2022',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}));

const server = httpServer.listen(8080, () => console.log("Servidor levantado en el puerto " + server.address().port));
server.on("error", (e) => console.log(`hubo un error ${e}`));

/**
 *  Render index
 */
app.get("/", (req, res) => {
    res.render("login");
});

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

        /* const eProductos = await bdCont.getAll(); */
        res.render("productos-test", {
            productos: fProductos,
            contenido: fProductos.length
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post("/login", urlencodedParser, (req, res) => {
    //const username = req.query.name;
    //console.log(req.session.nombre)
    //req.session.nombre = username; 
    const name = req.body.nombre;
    req.session.nombre = name;
    console.log(req.session.nombre)
    return res.render("index", {
        nombre: req.session.nombre
    });
    //return res.redirect("index");
});

app.get("/logout", (req, res) => {
    const nombre = req.session.nombre;
    if (nombre) {
        req.session.destroy(e => {
            if (!e) {
                res.render("logout", { nombre });
            } else {
                res.redirect('/');
            }
        });
    }
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
}