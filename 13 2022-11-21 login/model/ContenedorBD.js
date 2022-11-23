/**
 * Tomando como base las clases Contenedor en memoria y en archivos, desarrollar un nuevo contenedor
 * con idénticos métodos pero que funcione sobre bases de datos, utilizando Knex para la conexión. 
 * 
 * Esta clase debe recibir en su constructor el objeto de configuración de Knex y el nombre de la tabla 
 * sobre la cual trabajará. Luego, modificar el desafío entregable de la clase 11”Chat con Websocket”
 *  
 */
const { options } = require('./mariaDB.js');
const knex = require('knex')(options);// ?? Objeto de configuración de Knex

class ContenedorBD {

  constructor(tableName) {
     // ?? Objeto de configuración de Knex
    this.tableName = tableName; // Nombre de la tabla con la que trabajará
  }

  async save(obj) {
    try {
      knex(this.tableName).insert(obj)
        .then(() => {
          console.log('El artículo ha sido salvado en la base.');
        }).catch((e) => {
          console.log(e);
        });
    }
    catch (e) {
      throw new Error(`Error en el método (save()) \n: ${e.message}`);
    }
  }

  async update(obj, id) {
    try {
      knex(this.tableName)
        .where({ id: id })
        .update(obj)
        .then(() => {
          console.log('El artículo ha sido actualizado.');
        })
        .catch((e) => {
          console.log(e);
        });
    }
    catch (e) {
      throw new Error(`Error en el método (replace()) \n: ${e.message}`);
    }
  }

  async getAll() {
    try {
      return await knex
        .from(this.tableName)
        .select("*")
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(`Error en el método (getAll()): \n ${e.message}`);
    }
  }

  async getById(id) {
    try {
      return await knex
        .from(this.tableName)
        .select('*')
        .where({ id: id })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(`Error en el método (getById()) \n: ${e.message}`);
    }
  }

  async deleteById(id) {
    try {
      knex
        .from(this.tableName)
        .where({ id: id })
        .del()
        .then(() => {
          console.log('El artículo ha sido eliminado de la base.');
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      throw new Error(`Error en el método (deleteFile()) \n: ${e.message}`);
    }
  }
}

module.exports = ContenedorBD;