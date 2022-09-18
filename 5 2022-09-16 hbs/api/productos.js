/**
 *  1. Api Productos
 *  Formato: link a un repositorio en Github con el proyecto cargado. 
 *  Sugerencia: no incluir los node_modules
 * 
 *  Consigna: Realizar un proyecto de servidor basado en node.js y express que ofrezca una API RESTful de productos.
 */

// Imports
const Contenedor = require('./model/Contenedor');
const express = require('express');

// Server
const app = express();
const PORT = 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/static', express.static('public'));

const server = app.listen(PORT, () => {
    console.log('Server up n\' running.');
});

const routerProductos = express.Router();

const cont = new Contenedor('productos');

/**
 *  1. GET '/api/productos' -> devuelve todos los productos. 
 */
routerProductos.get('/productos', async (req, res) => {
    const productos = await cont.getAll();
    if (productos) {
        res.json({ productos });
    } else {
        res.json({ error: '400 Bad Request.' });
    }
});

/**
 *  2. GET '/api/productos/:id' -> devuelve un producto según su id.
 */
routerProductos.get('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id == undefined) {
        // Para el caso de que un producto no exista, se devolverá el objeto: { error: 'producto no encontrado' }
        res.json({ error: '400 - Bad Request.' });
    } else {
        const resultado = await cont.getById(id);
        if (resultado) {
            res.json({ resultado });
        } else {
            res.json({ error: 'producto no encontrado' });
        }

    }
});

/**
 *  3. POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
 */
routerProductos.post('/productos', async (req, res) => {
    const obj = req.body;
    if (obj) {
        const agregarProd = await cont.save(obj);
        const producto = await cont.getById(agregarProd);
        res.json({ producto });
    } else {
        res.json({ error: '400 - Bad Request.' });
    }
});

/**
 *  4. PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
 */
routerProductos.put('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const obj = req.body;
    if (isNaN(id) || id == undefined) {
        res.json({ error: '400 - Bad Request.' });
    } else {
        const productoBuscado = await cont.getById(id);
        if (productoBuscado) {
            await cont.replace(obj, id)
                .then(res.json(`201 - Modified >> id ${id} actualizado.`));
        } else {
            res.json({ error: '404 - Not found.' });
        }
    }
});

/**
 *  5. DELETE '/api/productos/:id' -> elimina un producto según su id.
 */
routerProductos.delete('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id == undefined) {
        res.json({ error: '400 - Bad Request.' });
    } else {
        const resultado = await cont.getById(id);
        if (resultado) {
            const productos = await cont.deleteById(id);
            res.json(`201 - Deleted >> id ${id} eliminado.`);
        } else {
            res.json('404 - Not found.');
        }
    }
});

app.use('/api', routerProductos);