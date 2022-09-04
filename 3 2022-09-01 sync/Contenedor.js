const fs = require('fs');

class Contenedor {

    constructor(fileName) {
        this.fileName = `./${fileName}.txt`;
    }

    getProductos() {
        try {
            if (this.fileName != '') {
                const data = fs.readFileSync(this.fileName, 'utf-8');
                const productos = JSON.parse(data);
                return productos;
            }
        } catch (error) {
            throw new Error('No se lograron recuperar los produtos.');
        }
    }

    getProductoById(myId) {
        try {
            if (this.fileName != '') {
                const data = fs.readFileSync(this.fileName, 'utf-8');
                const productos = JSON.parse(data);

                const found = productos.find((item) => item.id == myId);

                return found;
            } 
        } catch (error) {
            throw new Error('No se logró recuperar el id indicado.');
        }
    }
}

module.exports = Contenedor;
