import productModel from '../models/ProductModel.js';

export const getProductById = (id) => productModel.findById(id);

export const getAllProducts = (filters = {}) => productModel.find(filters);

export const getProductsByAdmin = (adminId) => productModel.find({ adminId });

export const createProduct = (data) => new productModel(data).save();

export const updateProduct = (id, data) =>
    productModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteProduct = (id, adminId) =>
    productModel.findOneAndDelete({ _id: id, adminId });
