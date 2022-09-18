/** 2022-09-14
 *  Formato: link a un repositorio en Github con los tres proyectos en carpetas separadas. 
 *  No incluir los node_modules.
 * 
 *  >> Consigna: 
 *      1. Utilizando la misma API de productos del proyecto entregable de la clase 
 *      anterior, construir un web server (no REST)...*  
 */
const fs = require('fs');
const Contenedor = require("./model/Contenedor");
const cont = new Contenedor('productos');
const express = require("express");
const app = express();
const PORT = 8080;

//const router = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.static("public"));

const server = app.listen(PORT, () => {
    console.log("servidor levantado en el puerto " + server.address().port);
});

server.on("error", (error) => console.log(`hubo un error ${error}`));

let productos = [];
const txt = fs.readFileSync('productos.txt', 'utf-8');
if (txt === '') {
    console.log('No hay productos en la base.');
} else {
     productos = JSON.parse(txt);
}

app.set("view engine", "ejs");

/**
 * a) Un formulario de carga de productos en la ruta raíz (configurar la ruta '/productos' para recibir el POST,
 *    y redirigir al mismo formulario).
 */
app.get("/", (req, res) => {
    res.render("formulario", { productos });
});

/**
 * b) Una vista de los productos cargados (utilizando plantillas de handlebars) en la ruta GET '/productos'.
 * c) Ambas páginas contarán con un botón que redirija a la otra.
 */
app.post("/productos", (req, res) => {
    productos.push(req.body);
    cont.save(req.body);
    res.render("formulario", { productos });
});

app.get("/listado", (req, res) => {
    res.render("listado", { productos });
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


