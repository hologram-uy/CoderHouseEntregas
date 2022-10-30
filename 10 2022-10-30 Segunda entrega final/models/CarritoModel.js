import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
    timeStamp: Date,
    productos: []
});

const CarritoSchema = mongoose.model('carrito', carritoSchema);

export default CarritoSchema;