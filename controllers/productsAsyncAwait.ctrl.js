const constants = require('../constants');
const productModel = require('../models/product.model');
const productService = require('../services/products.svc');
const config = require('../config');

const ProductCtrl = {
    get: async (req, res) => {
        try {
            const products = await productService.findAll();
            if (products && products.length > 0) {
                products.map(product => {
                    product.imgSrc = `${req.protocol}://${req.hostname}:${config.PORT}/${product.imgSrc}`
                });
                res.send({products});
                res.status(constants.STATUS_CODES.SUCCESS);
            } else {
                res.send({error: 'No products found'});
                res.status(constants.STATUS_CODES.NOT_FOUND);
            }
        } catch(error) {
            res.send({error});
            res.status(500);
        }
    },
    getById: async (req, res) => {        
        try {
            const id = req.params.id;
            const product = await productService.findById(id);
            if (product) {
                res.send(product);
                res.status(constants.STATUS_CODES.SUCCESS);
            } else {
                res.send({error: 'not_found', errorDescription: 'Product not found'});
                res.status(constants.STATUS_CODES.NOT_FOUND);
            }
        } catch(error) {
            res.send({error});
            res.status(500);
        }
    },
    create: async (req, res) => {
        try {
            console.log(req.body, 'In Controller');
            const product = await productService.findByName(req.body.name);
            if (product) {
                res.status(409);
                res.send({error: 'Already exist'});
            } else {
                const product = await productService.create(req.body);
                res.status(constants.STATUS_CODES.CREATED);
                res.send({status: 'Inserted successfully', product});
            }
        } catch(error) {
            res.status(500);
            res.send({error});
        }
    },  
    update: async (req, res) => {
        try {
            const product = await productService.findByIdByUpdate(req.params.id, req.body);
            if (product) {
                res.status(constants.STATUS_CODES.SUCCESS);
                const updatedProduct = product.toJSON();
                delete updatedProduct.price;
                res.send({data: updatedProduct, status: 'Updated successfully'});
            } else {
                res.status(constants.STATUS_CODES.CONFLICT);
                res.send({error: 'Product not found'});
            }
        } catch(error) {
            res.status(500);
            res.send({error});
        }
        // productService.findByIdByUpdate(req.params.id, req.body).then((product) => {
        //     if (product) {
        //         res.status(constants.STATUS_CODES.SUCCESS);
        //         const updatedProduct = product.toJSON();
        //         delete updatedProduct.price;
        //         res.send({data: updatedProduct, status: 'Updated successfully'});
        //     } else {
        //         res.status(constants.STATUS_CODES.CONFLICT);
        //         res.send({error: 'Product not found'});
        //     }
        // }).catch((error) => {
        //     res.status(500);
        //     res.send({error});
        // });
    },
    createOrUpdate: async (req, res) => {
        const requestBody = req.body;
        try {
            if (req.body.id) {
                const product = await productService.findByIdByUpdate(req.body.id, requestBody);
                if (product) {
                    res.status(constants.STATUS_CODES.SUCCESS);
                    res.send({data: product, status: 'Updated successfully'});
                } else {
                    res.status(constants.STATUS_CODES.CONFLICT);
                    res.send({error: 'Product not found'});
                }
            } else {
                const product = await productService.create(requestBody);
                if (product) {
                    res.status(constants.STATUS_CODES.CREATED);
                    res.send({status: 'Inserted successfully'});
                }
            }
        } catch(error) {
            res.status(500);
            res.send({error});
        }
        // if (req.body.id) {
        //     productModel.findByIdAndUpdate(req.body.id, {
        //         $set: {
        //             name: requestBody.name,
        //             imgSrc: requestBody.imgSrc,
        //             price: requestBody.price,
        //             specifications: requestBody.specifications,
        //             inStock: requestBody.inStock,
        //             category: requestBody.category
        //         }
        //     }, {new: true}, (err, product) => {
        //         if (product) {
        //             res.status(constants.STATUS_CODES.SUCCESS);
        //             res.send({data: product, status: 'Updated successfully'});
        //         } else {
        //             res.status(500);
        //             res.send({err});
        //         }
        //     });
        // } else {
        //     const product = new productModel(req.body);
        //     product.save((err, product) => {
        //         if (product) {
        //             res.status(constants.STATUS_CODES.CREATED);
        //             res.send({status: 'Inserted successfully'});
        //         } else {
        //             res.status(500);
        //             res.send({err});
        //         }
        //     });
        // }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            const product = await productService.findByIdByDelete(id);
            if (product) {
                res.status(constants.STATUS_CODES.SUCCESS);
                res.send({status: 'deleted successfully'});
            }  else {
                res.status(constants.STATUS_CODES.CONFLICT);
                res.send({error: 'Product not found'});
            }
        } catch(error) {
            res.status(500);
            res.send({error});
        }
        // const id = req.params.id;
        // productModel.findByIdAndDelete(id, (err, product) =>{
        //     if (product) {
        //         res.status(constants.STATUS_CODES.SUCCESS);
        //         res.send({status: 'deleted successfully'});
        //     } else {
        //         res.send({err: 'failed to delete'});
        //     }
        // });
    },
    byPagination: async (req, res) => {
        try {
            let pageIndex = +req.params.pageIndex || 0;
            let pageSize = +req.params.pageSize || 10;
            let sortParam = req.params.sort || 'createdAt';
            let direction = req.params.direction;
            const cnt = await productService.findTotalCount();
            if (cnt) {
                let totalPages = Math.ceil(cnt/pageSize);
                let metadata = {
                    count: cnt,
                    totalPages: totalPages,
                    hasPrevious: pageIndex > 0,
                    hasNext: pageIndex < totalPages - 1
                };
                const products = await productService.findProductForPagination(pageIndex, pageSize, sortParam, direction);
                if (products) {
                    const response2 = {metadata, products};
                    res.status(200);
                    res.send(response2);
                }
            }
        } catch(error) {
            res.status(500);
            console.log(error);
            res.send({error});
        }
        // let pageIndex = +req.params.pageIndex || 0;
        // let pageSize = +req.params.pageSize || 10;
        // productService.findTotalCount().then((cnt) => {
        //     let totalPages = Math.ceil(cnt/pageSize);
        //     let metadata = {
        //         count: cnt,
        //         totalPages: totalPages,
        //         hasPrevious: pageIndex > 0,
        //         hasNext: pageIndex < totalPages - 1
        //     };
        //     productService.findProductForPagination(pageIndex, pageSize).then((response) => {
        //         const response2 = {metadata, products: response};
        //         res.status(200);
        //         res.send(response2);
        //     }).catch((error) => {
        //         res.status(500);
        //         res.send({error});
        //     });
        // }).catch((error) => {
        //     res.status(500);
        //     res.send({error});
        // })
    }
}

module.exports = ProductCtrl;

// Array.splice(currentIndex, noOfValuesToDelete, insertNewValue1, insertNewValue2, insertNewValueN);


// const products = null;

// const promise = new Promise((resolve, reject) => {
//     if (products && products.length > 0) {
//         resolve(products);
//     } else {
//         reject({error: 'not found'});
//     }
// });
// promise.then((products) => {
//     res.status(200);
//     res.send(products);
// }).catch((error) => {
//     console.log(error);
//     res.status(500);
//     res.send(error);
// });

// Total Records: 100
// No of Pages: 5
// PageSize: 20

// totalRecords/pageSize = No of Pages
// pageIndex (0 - 4)


// 1 - 10

// 11 - 20
// 21 - 30

