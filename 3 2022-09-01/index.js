/**
 *  Formato: link a un repositorio en Github y url de proyecto subido a glitch.
 *  Observación: no incluir la carpeta node_modules.
 * 
 *  >> Consigna:
 *  1. Realizar un proyecto de servidor basado en node.js que utilice el módulo express e implemente los siguientes endpoints en el puerto 8080:
 *      a) Ruta get '/productos' que devuelva un array con todos los productos disponibles en el servidor
 *      b) Ruta get '/productoRandom' que devuelva un producto elegido al azar entre todos los productos disponibles
 *  2. Incluir un archivo de texto 'productos.txt' y utilizar la clase Contenedor del desafío anterior para acceder a los datos persistidos del servidor.
 *
 *  Antes de iniciar el servidor, colocar en el archivo 'productos.txt' tres productos como en el ejemplo del desafío anterior.
 */

// Import class
const Contenedor = require('./Contenedor.js');

/**
 * 1. Dedicated server space.
 */
const myPort = 8080;
const wwPort = process.env.PORT;

const express = require("express");
const app = express();
const PORT = 8080; // myPort / wwPort;

const server = app.listen(PORT, () =>{
    console.log('Initializing server..');
})

/**
 * 2. Class invoke | Generate random.
 */
const cont = new Contenedor('productos');

/** 
 * 3. Routes:
 */
app.get('/productos', (req, resp) => {
    resp.send(cont.getProductos());
});


app.get("/productosRandom", (req, resp) =>{  
  const random = parseFloat((Math.random()*10)+1).toFixed();
  resp.send(cont.getProductoById(random));
});