import Contenedor from './Contenedor.class.js';

export default class Producto {
    constructor() {
        this.cont = new Contenedor('Productos');
    }

    async get(id) {
        const producto = await this.cont.getById(id);
        return producto || false;
    }

    async getAll() {
        const productos = await this.cont.getAll();
        return productos || false;
    }

    async save(prod) {
        prod.timeStamp = Date.now();
        const p = this.cont.save(prod);
        return p;
    }

    async update(prod, id) {
        const productos = await this.cont.getAll();
        const productoModificado = productos.find(p => p.id == id);
        if (productoModificado) {
            productoModificado.nombre = prod.nombre;
            productoModificado.descripcion = prod.descripcion;
            productoModificado.codigo = prod.codigo;
            productoModificado.foto = prod.foto;
            productoModificado.precio = prod.precio;
            productoModificado.timeStamp = Date.now();
            await this.cont.saveList(productos);
            return true;
        } else {
            return false;
        }
    }

    async oldUpdate(prod, id) {
        await this.cont.deleteById(id);
        await this.cont.save(prod);
    }

    async delete(id) {
        const deleted = await this.cont.deleteById(id);
        return deleted;
    }
}

