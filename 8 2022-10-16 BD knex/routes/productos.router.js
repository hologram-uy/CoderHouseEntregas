const Productos = require('../api/productos.js');
const ContenedorBD = require('../model/ContenedorBD.js');
const express = require("express");
const router = express.Router();

const bdCont = new ContenedorBD('productos');
const productos = new Productos();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 *  1. GET '/api/productos' -> devuelve todos los productos. 
 */
router.get("/productos/list", async (req, res) => {
    try {
        const lista = await bdCont.getAll();
        return res.status(200).json({ lista });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 *  2. GET '/api/productos/listar/:id' -> devuelve un producto según su id.
 */
router.get("/productos/list/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id == undefined) {
            return res.status(400).json({ error: 'El id ingresado no es válido.' });
        } else {
            const resultado = await bdCont.getById(id);
            if (resultado === undefined || resultado.length == 0) {
                return res.status(404).json({ error: 'El id ingresado no existe.' });
            } else {
                return res.status(200).json({ resultado });
            }
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 *  3. POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
 */
router.post("/productos/save", async (req, res) => {
    try {
        let producto = req.body;
        await bdCont.save(producto);
        //res.redirect('/');
        return res.status(200).send({ response: `El producto fue agregado con éxito.` });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 *  4. PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
 */
router.put("/productos/update/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id == undefined) {
            return res.status(400).json({ error: 'El id ingresado no es válido.' });
        } else {
            let producto = req.body;
            if (producto) {
                await bdCont.update(producto, id);
                return res.status(201).json({ producto });
            } else {
                return res.status(400).send({ error: 'El id especificado no existe.' });
            }
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

/**
 *  5. DELETE '/api/productos/:id' -> elimina un producto según su id.
 */
router.delete("/productos/delete/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id == undefined) {
            return res.status(400).json({ error: 'El id ingresado no es válido.' });
        } else {
            const resultado = await bdCont.getById(id);
            if (resultado.length > 0) {
                await bdCont.deleteById(id);
                return res.status(201).json(`El producto fue eliminado.`);
            } else {
                return res.status(400).json({ error: 'El id especificado no existe.' });
            }
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.get('*', (req, res) => {
    try {
        res.status(404).render('404', {
            titulo: '404 - algo salió mal..',
            info: 'La URL especificada no se encuentra en este servidor.'
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = { router };