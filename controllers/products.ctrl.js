const data = require('../data');
const constants = require('../constants');
const e = require('express');
const productModel = require('../models/product.model');

const ProductCtrl = {
    get: (req, res) => {
        // data.products.forEach( product => {
        //     if (product.id === 1001) {
        //         product.price = 9999
        //     }
        // });
        productModel.find((err, products) =>{
            if (err) {
                res.send({err});
                res.status(500);
            } else {
                res.send({products});
                res.status(constants.STATUS_CODES.SUCCESS);
            }
        });
    },
    getById: (req, res) => {
        // const id = +req.params.id;
        const id = req.params.id;
        // const {id, name, phone} = req.query;
        // const product = data.products.find(product => product.id === id);
        // if (product) {
        //     res.send(product);
        //     res.status(constants.STATUS_CODES.SUCCESS);
        // } else {
        //     res.send({error: 'not_found', errorDescription: 'Product not found'});
        //     res.status(constants.STATUS_CODES.NOT_FOUND);
        // }
        productModel.findById(id, (err, product) => {
            if (product) {
                res.send(product);
                res.status(constants.STATUS_CODES.SUCCESS);
            } else {
                res.send({error: 'not_found', errorDescription: 'Product not found'});
                res.status(constants.STATUS_CODES.NOT_FOUND);
            }
        });
    },
    create: (req, res) => {
        const requestBody = req.body;
        const product = new productModel(req.body);
        product.save((err, product) => {
            if (product) {
                res.status(constants.STATUS_CODES.CREATED);
                res.send({status: 'Inserted successfully'});
            } else {
                res.status(500);
                res.send({err});
            }
        });
        // const product = data.products.find(product => product.id === requestBody.id);
        // if (product) {
        //     res.send({error: 'duplicate_record', errorDescription: 'Product already exist'});
        //     res.status(constants.STATUS_CODES.CONFLICT);
        // } else {
        //     data.products.push(req.body);
        //     res.status(constants.STATUS_CODES.CREATED);
        //     res.send({status: 'Inserted successfully'});
        // }
    },
    update: (req, res) => {
        const requestBody = req.body;
        productModel.findByIdAndUpdate(req.params.id, {
            $set: {
                name: requestBody.name,
                imgSrc: requestBody.imgSrc,
                price: requestBody.price,
                specifications: requestBody.specifications,
                inStock: requestBody.inStock,
                category: requestBody.category
            }
        }, {new: true}, (err, product) => {
            if (product) {
                res.status(constants.STATUS_CODES.SUCCESS);
                res.send({data: product, status: 'Updated successfully'});
            } else {
                res.status(500);
                res.send({err});
            }
        });
        // const productIndex = data.products.findIndex(product => product.id === requestBody.id);
        // console.log(productIndex);
        // if (productIndex > -1) {
        //     data.products.forEach((product, index) => {
        //         if (index === productIndex) {
        //             product.name = requestBody.name,
        //             product.imgSrc = requestBody.imgSrc,
        //             product.price = requestBody.price,
        //             product.ratings = requestBody.ratings,
        //             product.reviews = requestBody.reviews,
        //             product.specifications = requestBody.specifications
        //         }
        //     });
        //     res.status(constants.STATUS_CODES.SUCCESS);
        //     res.send({data: data.products[productIndex]});
        // } else {
        //     res.status(constants.STATUS_CODES.NOT_FOUND);
        //     res.send({error: 'not_found', errorDescription: 'Product not found'});
        // }
    },
    createOrUpdate: (req, res) => {
        const requestBody = req.body;
        if (req.body.id) {
            productModel.findByIdAndUpdate(req.body.id, {
                $set: {
                    name: requestBody.name,
                    imgSrc: requestBody.imgSrc,
                    price: requestBody.price,
                    specifications: requestBody.specifications,
                    inStock: requestBody.inStock,
                    category: requestBody.category
                }
            }, {new: true}, (err, product) => {
                if (product) {
                    res.status(constants.STATUS_CODES.SUCCESS);
                    res.send({data: product, status: 'Updated successfully'});
                } else {
                    res.status(500);
                    res.send({err});
                }
            });
        } else {
            const product = new productModel(req.body);
            product.save((err, product) => {
                if (product) {
                    res.status(constants.STATUS_CODES.CREATED);
                    res.send({status: 'Inserted successfully'});
                } else {
                    res.status(500);
                    res.send({err});
                }
            });
        }
        // const productIndex = data.products.findIndex(product => product.id === requestBody.id);
        // if (productIndex > -1) {
        //     data.products.forEach((product, index) => {
        //         if (index === productIndex) {
        //             product.name = requestBody.name,
        //             product.imgSrc = requestBody.imgSrc,
        //             product.price = requestBody.price,
        //             product.ratings = requestBody.ratings,
        //             product.reviews = requestBody.reviews,
        //             product.specifications = requestBody.specifications
        //         }
        //     });
        //     res.status(constants.STATUS_CODES.SUCCESS);
        //     res.send({data: data.products[productIndex], status: 'Updated successfully'});
        // } else {
        //     data.products.push(req.body);
        //     res.status(constants.STATUS_CODES.CREATED);
        //     res.send({status: 'Inserted successfully', data: data.products[data.products.length - 1]});
        // } 
    },
    delete: (req, res) => {
        const id = req.params.id;
        // const productIndex = data.products.findIndex(product => product.id === id);
        // if (productIndex > -1) {
        //     data.products.splice(productIndex, 1);
        //     res.status(constants.STATUS_CODES.SUCCESS);
        //     res.send({status: 'Deleted successfully'});
        // } else {
        //     res.status(constants.STATUS_CODES.NOT_FOUND);
        //     res.send({error: 'not_found', errorDescription: 'Product not found'});
        // }
        productModel.findByIdAndDelete(id, (err, product) =>{
            if (product) {
                res.status(constants.STATUS_CODES.SUCCESS);
                res.send({status: 'deleted successfully'});
            } else {
                res.send({err: 'failed to delete'});
            }
        });
    }
}

module.exports = ProductCtrl;

// Array.splice(currentIndex, noOfValuesToDelete, insertNewValue1, insertNewValue2, insertNewValueN);