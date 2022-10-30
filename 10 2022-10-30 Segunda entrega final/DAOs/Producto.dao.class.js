import mongoose from 'mongoose';
import mongoUrl from './config.js';
import ProductoModel from '../models/ProductoModel.js';

export default class Producto {
    constructor() {
        this.url = mongoUrl;
        this.mongodb = mongoose.connect;
    }

    async get(id) {
        try {
            await this.mongodb(this.url);
            return await ProductoModel.findById(id);
        } catch (error) {
            throw new Error(e);
        }
    }

    async getAll() {
        try {
            await this.mongodb(this.url);
            return await ProductoModel.find();
        } catch (error) {
            throw new Error(e);
        }
    }

    async save(prod) {
        try {
            await this.mongodb(this.url);
            const newProd = new ProductoModel(prod);
            newProd.timeStamp = Date.now();
            return await newProd.save();
        } catch (e) {
            throw new Error(e);
        }
    }

    async update(prod, id) {
        try {
            await this.mongodb(this.url);
            if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
                // valid ObjectId => findById
                return false;
            }

            const encontrado = await ProductoModel.findById(id);

            if (encontrado == null) {
                return false;
            } else {
                if (encontrado.id == id) {
                    return await ProductoModel.findByIdAndUpdate(id, prod);
                }
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async delete(id) {
        try {
            await this.mongodb(this.url);
            if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
                // valid ObjectId => findById
                return false;
            }
            const obj = await ProductoModel.findById(id);

            if (obj == null) {
                return false;
            } else {
                if (obj.id == id) {
                    return await ProductoModel.findByIdAndDelete(id);
                }
            }
        } catch (e) {
            throw new Error(e);
        }
    }
}

