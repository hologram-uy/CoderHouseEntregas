import mongoose from 'mongoose';
import mongoUrl from './config.js';
import CarritoModel from '../models/CarritoModel.js';
import ProductoModel from '../models/ProductoModel.js';

export default class Carrito {
    constructor() {
        this.url = mongoUrl;
        this.mongodb = mongoose.connect;
    }

    async get(id) {
        try {
            await this.mongodb(this.url);
            return await CarritoModel.findById(id);
        } catch (error) {
            throw new Error(e);
        }
    }

    async getAll() {
        try {
            await this.mongodb(this.url);
            return await CarritoModel.find();
        } catch (error) {
            throw new Error(e);
        }
    }

    async save() {
        try {
            await this.mongodb(this.url);
            const newCarr = new CarritoModel();
            newCarr.timeStamp = Date.now();
            return await newCarr.save();
        } catch (e) {
            throw new Error(e);
        }
    }

    async addProd(idCarr, idProd) {
        try {
            await this.mongodb(this.url);

            const prod = await ProductoModel.findById(idProd);
            if (!prod) return false;

            const target = await CarritoModel.findById(idCarr);
            if (!target) return false;

            return await CarritoModel.findByIdAndUpdate(target, { $push: { 'productos': prod } });

        } catch (e) {
            return e;
        }
    }

    async delete(id) {
        try {
            await this.mongodb(this.url);
            if (!(id.match(/^[0-9a-fA-F]{24}$/))) {
                // valid ObjectId => findById
                return false;
            }
            const obj = await CarritoModel.findById(id);

            if (obj == null) {
                return false;
            } else {
                if (obj.id == id) {
                    return await CarritoModel.findByIdAndDelete(id);
                }
            }
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteProd(idCarr, idProd) {
        try {
            await this.mongodb(this.url);

            const prod = await ProductoModel.findById(idProd);
            if (!prod) return false;

            const target = await CarritoModel.findById(idCarr);
            if (!target) return false;

            return await CarritoModel.findByIdAndUpdate(target, { $pull: { 'productos': prod } });

        } catch (e) {
            return e;
        }
    }
}