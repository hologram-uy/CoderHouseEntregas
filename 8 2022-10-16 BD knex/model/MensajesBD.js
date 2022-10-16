const { options } = require('./sqlite3.js');
const knex = require('knex')(options);

class MensajesBD {

    constructor() {
        this.tableName = 'mensajes';        
    }

    save(obj) {
        try {
            knex(this.tableName).insert(obj)
                .then(() => {
                    console.log('El mensaje ha sido salvado en la base.');
                });
        }
        catch (e) {
            throw new Error(`Error en el método (save()) \n: ${e.message}`);
        }
    }

    getAll() {
        try {
            return knex
                .from(this.tableName)
                .select("*");
        } catch (e) {
            throw new Error(`Error en el método (getAll()): \n ${e.message}`);
        }
    }

    getById(id) {
        try {
            return knex
                .from(this.tableName)
                .select('*')
                .where({ id: id });
        } catch (e) {
            throw new Error(`Error en el método (getById()) \n: ${e.message}`);
        }
    }

    deleteById(id) {
        try {
            knex
                .from(this.tableName)
                .where({ id: id })
                .del()
                .then(() => {
                    console.log('El mensaje ha sido eliminado de la base.');
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (e) {
            throw new Error(`Error en el método (deleteFile()) \n: ${e.message}`);
        }
    }
}

module.exports = MensajesBD;