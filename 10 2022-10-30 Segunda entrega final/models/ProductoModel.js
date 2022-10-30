import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    stock: Number,
    descripcion: String,
    foto: String,
    timeStamp: Date
});

const ProductoModel = mongoose.model('producto', productoSchema);

export default ProductoModel;