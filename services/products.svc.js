const productModel = require('../models/product.model');
const multer = require('multer');

const productService = {
    create: (data) => {
        const product = new productModel(data);
        return product.save();
    },
    findAll: () => {
        return productModel.find().exec();
    },
    findById: (id) => {
        return productModel.findById(id).exec();
    },
    findByName: (name) => {
        return productModel.findOne({name}).exec();
    },
    findByIdByUpdate: (id, data) => {
        return productModel.findByIdAndUpdate(id, {
            $set: {
                name: data.name,
                imgSrc: data.imgSrc,
                price: data.price,
                specifications: data.specifications,
                inStock: data.inStock,
                category: data.category
            }
        }, {fields: {__v: 0, createdAt: 0}, new: true}).exec();
    },
    findByIdByDelete: (id) => {
        return productModel.findOneAndDelete(id).exec();
    },
    findTotalCount: () => {
        return productModel.count();
    },
    findProductForPagination: (pageIndex, pageSize, sortParam, direction) => {
        direction = direction === 'asc' ? ' ': '-';
        return productModel.find()
                            .skip(pageIndex * pageSize)
                            .sort(direction + sortParam)
                            .limit(pageSize)
                            .exec();
    },
    upload: (req, res, next) => {
        if (req.files['image']) {
            const storage = multer.diskStorage({
                filename: (request, file, cb) => {
                    let filename = Date.now() + '-' + file.originalname;
                    request.body.imgSrc = filename;
                    cb(null, filename);
                },
                destination: (request, file, cb) => {
                    cb(null, 'uploads/');
                }
            });
            const uploadImage = multer({storage});
            uploadImage.single(req.files['image']);
            next();
        } else {
            next();
        }
    }
}

module.exports = productService;

// 0 * 10 = 0
// 1 * 10 = 10


// sort(createdAt) - Ascending Order
// sort(-createdAt) - Descending order