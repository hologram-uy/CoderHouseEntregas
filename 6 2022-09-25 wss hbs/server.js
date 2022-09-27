/**
 *  Entrega nro. 6
 */
const Productos = require('./api/productos');
const Mensajes = require('./Model/Contenedor');
const fs = require("fs");
const express = require("express");
const hbs = require('express-handlebars');
const app = express();
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const { Server: IOServer } = require("socket.io");
const { Server: HttpServer } = require("http");
const Contenedor = require('./Model/Contenedor');
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

const productos = new Productos();
const persisteMje = new Mensajes('centroMensajes');
const messages = [];

const server = httpServer.listen(8080, () => console.log("Servidor levantado en el puerto " + server.address().port));
server.on("error", (error) => console.log(`hubo un error ${error}`));

/**
 *  Render index
 */
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/listado", (req, res) => {
    const prods = productos.getAll();
    if (prods) {
        res.render("listado", {
            productos: prods,
            contenido: prods.length
        });
    }
});

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado..')
    /**
     *  Productos
     */
    socket.emit('productos', productos.getAll());
    socket.on('new-prod', data => {
        productos.save(data);
        io.sockets.emit('productos', productos.getAll());
    });

    /**
     *  Mensajes
     */
    socket.emit('mensajes', messages);
    socket.on("new-message", (data) => {
        messages.push(data);
        persisteMje.save(data);
        io.sockets.emit("messages", messages);
    });
});

/* <------------------------- API -------------------------> */

app.use('/api', router);

/**
 *  1. GET '/api/productos' -> devuelve todos los productos. 
 */
router.get("/productos/list", (req, res) => {
    const lista = productos.getAll();
    return res.status(200).json({ lista });
});

/**
 *  2. GET '/api/productos/listar/:id' -> devuelve un producto según su id.
 */
router.get("/productos/list/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id == undefined) {
        return res.status(400).json({ error: 'El id ingresado no es válido.' });
    } else {
        const resultado = productos.getById(id);
        if (resultado) {
            return res.status(200).json({ resultado });
        }
    }
});

/**
 *  3. POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
 */
router.post("/productos/save", (req, res) => {
    let producto = req.body;
    productos.save(producto);
    res.redirect('/');
    return res.status(200).json(`El producto con id ${producto.id} fue añadido con exito.`);
});

/**
 *  4. PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
 */
router.put("/productos/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id == undefined) {
        return res.status(400).json({ error: 'El id ingresado no es válido.' });
    } else {
        let producto = req.body;
        if (producto) {
            productos.update(producto, id);
            return res.status(201).json({ producto });
        } else {
            return res.status(400).json({ error: 'El id especificado no existe.' });
        }
    }
});

/**
 *  5. DELETE '/api/productos/:id' -> elimina un producto según su id.
 */
router.delete("/productos/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id == undefined) {
        return res.status(400).json({ error: 'El id ingresado no es válido.' });
    } else {
        const resultado = productos.getById(id);
        if (resultado.id === id) {
            productos.deleteById(id);
            return res.status(201).json(`El id ${id} fue eliminado.`);
        } else {
            return res.status(400).json({ error: 'El id especificado no existe.' });
        }
    }
});

router.get('*', (req, res) => {
    res.status(404).render('404', {
        titulo: '404 - algo salió mal..',
        info: 'La URL especificada no se encuentra en este servidor.'
    });
});

router.post('*', (req, res) => {
    res.status(404).render('404', {
        titulo: '404 - algo salió mal..',
        info: 'La URL especificada no se encuentra en este servidor.'
    });
});




