import Producto from './Producto.class.js';
import Contenedor from './Contenedor.class.js';

export default class Carrito {
    constructor() {
        this.producto = new Producto();
        this.contCarr = new Contenedor('Carritos');
        this.contProd = new Contenedor('Productos');
    }

    async get(id) {
        try {
            const carr = await this.contCarr.getById(id);
            return carr || 404;
        } catch (e) {
            return e;
        }
    }

    async getAll() {
        try {
            const carritos = await this.contCarr.getAll();
            return carritos || 404;
        } catch (e) {
            return e;
        }
    }

    async save() {
        try {
            const carr = {
                timeStamp: Date.now(),
                productos: []
            };
            return await this.contCarr.save(carr) || 400;
        } catch (e) {
            return e;
        }
    }

    async addProd(idCarr, idProd) {
        try {
            const prod = await this.contProd.getById(idProd);
            if (!prod) return 404;

            let target = await this.contCarr.getById(idCarr);
            if (!target) return 404;

            let misCarritos = await this.contCarr.getAll();
            if (!misCarritos) return 404;

            misCarritos = misCarritos.filter((carr) => carr.id != target.id)
            target.productos.push(prod);
            target.timeStamp = Date.now();
            target.id = parseInt(idCarr);
            misCarritos.push(target);
            misCarritos.sort((a, b) => a.id - b.id);

            return this.contCarr.saveList(misCarritos);
        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            const deleted = await this.contCarr.deleteById(id);
            return deleted;
        } catch (e) {
            return e;
        }
    }

    async deleteProd(idCarr, idProd) {
        try {
            const prod = await this.contProd.getById(idProd);
            if (!prod) return 404;
            
            let misCarritos = await this.contCarr.getAll();
            if (!misCarritos) return 404;

            let target = await this.contCarr.getById(idCarr);
            if (!target) return 404;

            misCarritos = misCarritos.filter((carr) => carr.id != idCarr);

            target.productos = target.productos.filter((prod) => prod.id != idProd);
            target.timeStamp = Date.now();
            target.id = parseInt(idCarr);

            misCarritos.push(target);
            misCarritos.sort((a, b) => a.id - b.id);

            this.contCarr.saveList(misCarritos);

            return 200;
        } catch (e) {
            return e;
        }
    }
}