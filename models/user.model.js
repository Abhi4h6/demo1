const mongoose = require('mongoose');

const userModel = mongoose.model('user', {
    email: {
        type: String,
    },
    password: {
        type: String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    mobile: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    profilePic: {
        type: String,
        default: ''
    },
    createdAt: {
        type: String,
        default: Date.now()
    }
});

module.exports = userModel;