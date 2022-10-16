/**
 * Desarrollar también un script que utilizando knex cree las tablas necesarias 
 * para la persistencia en cuestión (tabla mensajes en sqlite3 y tabla productos 
 * en mariaDb). 
 */

/**
 * Parámetros de configuración SQLite3
 */
/* const knex = require('knex')({
    client: 'sqlite3',
    connection: { filename: './DB/ecommerce.sqlite' },
    useNullAsDefault: true,
}); */

/**
 * Creación de tabla SQLite3
 */
/* knex.schema
    .createTable('mensajes', (table) => {
        table.string('author');
        table.string('myTime');
        table.string('text');
        table.increments('id');
    })
    .then(() => {
        console.log('Table created ..');
    })
    .catch((e) => {
        console.log(e);
    }); */

/* knex
    .from('mensajes')
    .select('*')
    .then((rows) => {
        console.log(rows);
    }); */


/**
 * Parámetros de configuración MariaDB
 */
/* const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'ecommerceProd'
    },
}); */

/**
 * Creación de tabla mySql
 */
/* knex.schema.hasTable('productos')
    .then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('productos', (table) => {
                table.string("title");
                table.float("price");
                table.string("thumbnail");
                table.increments("id");
            })
        };
    })
    .then(() => {
        console.log('Table created ..');
    })
    .catch((e) => {
        console.log(e);
    }); */
