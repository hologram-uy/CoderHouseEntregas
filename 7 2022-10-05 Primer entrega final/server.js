/**
 *  Entrega nro. 7
 */
//const Productos = require('./api/productos');
const { router } = require('./routes/productos.router.js');
const ContenedorBD = require('./model/ContenedorBD.js');
const MensajesBD = require('./model/MensajesBD.js');
//const Mensajes = require('./model/Contenedor');
const express = require("express");
const hbs = require('express-handlebars');
const app = express();

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

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

app.use('/api', router);

//const productos = new Productos();
//const persisteMje = new Mensajes('centroMensajes');
const bdCont = new ContenedorBD('productos');
const bdMjes = new MensajesBD();
const messages = [];

const server = httpServer.listen(8080, () => console.log("Servidor levantado en el puerto " + server.address().port));
server.on("error", (e) => console.log(`hubo un error ${e}`));

/**
 *  Render index
 */
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/listado", async (req, res) => {
    try {
        const prods = await bdCont.getAll();
        res.render("listado", {
            productos: prods,
            contenido: prods.length
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado..')

    /**
     *  Productos
     */
    socket.emit('productos', await bdCont.getAll());

    socket.on('new-prod', async (data) => {
        await bdCont.save(data);
        const prods = await bdCont.getAll();
        io.sockets.emit('productos', prods);
    });

    /**
     *  Mensajes
     */
    socket.emit('mensajes', messages);
    socket.on("new-message", (data) => {
        messages.push(data);
        bdMjes.save(data);
        io.sockets.emit("messages", messages);
    });
});


