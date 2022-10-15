import Producto from './Producto.class.js';
import Contenedor from './Contenedor.class.js';

export default class Carrito {
    constructor() {
        this.producto = new Producto();
        this.contCarr = new Contenedor('Carritos');
        this.contProd = new Contenedor('Productos');
    }

    async get(id) {
        const carr = await this.contCarr.getById(id);
        return carr || false;
    }

    async getAll() {
        const carritos = await this.contCarr.getAll();
        return carritos || false;
    }

    async save() {
        const carr = {
            timeStamp: Date.now(),
            productos: []
        };
        return await this.contCarr.save(carr) || false;
    }

    async addProd(idCarr, idProd) {
        const prod = await this.contProd.getById(idProd);
        if (!prod) return false;

        let target = await this.contCarr.getById(idCarr);
        if (!target) return false;

        let misCarritos = await this.contCarr.getAll();
        if (!misCarritos) return false;

        misCarritos = misCarritos.filter((carr) => carr.id != target.id)
        target.productos.push(prod);
        target.timeStamp = Date.now();
        target.id = parseInt(idCarr);
        misCarritos.push(target);
        misCarritos.sort((a, b) => a.id - b.id);
        this.contCarr.saveList(misCarritos);

        return true;
    }

    async delete(id) {
        const prodEliminado = await this.contCarr.deleteById(id);
        console.log(prodEliminado);
        if (prodEliminado == true) {
            return true;
        }
        return false;
    }

    async deleteProd(idCarr, idProd) {
        const prod = await this.contProd.getById(idProd);
        if (!prod) return false;

        let misCarritos = await this.contCarr.getAll();
        if (!misCarritos) return false;

        let target = await this.contCarr.getById(idCarr);
        if (!target) return false;

        misCarritos = misCarritos.filter((carr) => carr.id != idCarr);

        target.productos = target.productos.filter((prod) => prod.id != idProd);
        target.timeStamp = Date.now();
        target.id = parseInt(idCarr);

        misCarritos.push(target);
        misCarritos.sort((a, b) => a.id - b.id);

        this.contCarr.saveList(misCarritos);

        return true;
    }
}