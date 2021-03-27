const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number
    },
    name: {
        type: String,
    },
    description: {
        type: String
    }
});

const productModel = mongoose.model('Product', {
    name: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
    },
    inStock: {
        type: Boolean
    },
    specifications: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    imgSrc: {
        type: String,
        default: 'default.jpeg'
    },
    review: [reviewSchema]
});

module.exports = productModel;