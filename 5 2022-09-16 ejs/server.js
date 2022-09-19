/** 2022-09-14
 *  Formato: link a un repositorio en Github con los tres proyectos en carpetas separadas. 
 *  No incluir los node_modules.
 * 
 *  >> Consigna: 
 *      1. Utilizando la misma API de productos del proyecto entregable de la clase 
 *      anterior, construir un web server (no REST)...*  
 */

const Productos = require('./api/productos.js');
const express = require("express");
const app = express();
const PORT = 8080;

let productos = new Productos();


// Comentar/descomentar para pruebas
productos.save({
    "title": "Escuadra",
    "price": 123.45,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    "id": 1
});

productos.save({
    "title": "Calculadora",
    "price": 234.56,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
    "id": 2
});

productos.save({
    "title": "Globo Terráqueo",
    "price": 345.67,
    "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
    "id": 3
});

const server = app.listen(PORT, () => {
    console.log("servidor levantado en el puerto " + server.address().port);
});

server.on("error", (error) => console.log(`hubo un error ${error}`));

/**
 *  Configuración para motor plantilla EJS
 */
app.set("view engine", "ejs");

app.use(express.static("public"));

const router = express.Router();
app.use('/api', router);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/**
 *  1. GET '/api/productos' -> devuelve todos los productos. 
 *      2022-09-18 >> Se modifica para adecuar a entrega nro. 5.
 */
router.get("/productos/list", (req, res) => {
    const lista = productos.getAll();
    return res.status(200).json({ lista });
});

/**
 *  2. GET '/api/productos/listar/:id' -> devuelve un producto según su id.
 *      2022-09-18 >> Se modifica para adecuar a entrega nro. 5.
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

/**
 * a) Un formulario de carga de productos en la ruta raíz (configurar la ruta '/productos' para 
 *    recibir el POST, y redirigir al mismo formulario).
 */
router.post("/productos/save", (req, res) => {
    let producto = req.body;
    if (producto) {
        productos.save(producto);
        //res.status(201).json({ producto });
        return res.redirect("/");
    } else {
        res.status(400).json({ error: 'Error al agregar el producto.' });
    }
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
            return res.status(404).json({ error: 'El id especificado no existe.' });
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
            return res.status(201).json({ error: `El id ${id} fue eliminado.` });
        } else {
            return res.status(404).json({ error: 'El id especificado no existe.' });
        }
    }
});

/**
 * b) Una vista de los productos cargados (utilizando plantillas de handlebars) en la ruta GET '/productos'.
 * c) Ambas páginas contarán con un botón que redirija a la otra.
 */
router.get("/productos/listado", (req, res) => {
    const prods = productos.getAll();
    if (prods) {
        res.render("listado", {
            productos: prods,
            contenido: prods.length
        });
    } else {
        return res.status(404).json({ error: 'No se encontró el recurso.' });
    }
});


/**
 *  .. Otros acpectos a considerar:
 * 
 *  >> Consigna:  
 *      2. Manteniendo la misma funcionalidad reemplazar el motor de plantillas handlebars por pug.
 *      3. Manteniendo la misma funcionalidad reemplazar el motor de plantillas handlebars por ejs.
 *      4. Por escrito, indicar cuál de los tres motores de plantillas prefieres para tu proyecto y por qué.
 * 
 *  >> Aspectos a incluir en el entregable:
 *      - Realizar las plantillas correspondientes que permitan recorrer el array de productos y representarlo en forma de tabla dinámica, 
 *        siendo sus cabeceras el nombre de producto, el precio y su foto (la foto se mostrará como un imágen en la tabla)
 *      - En el caso de no encontrarse datos, mostrar el mensaje: 'No hay productos'.
 */


