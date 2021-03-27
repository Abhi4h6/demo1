const userModel = require('../models/user.model');

class UserService {
    create(data) {
        const user = new userModel(data);
        return user.save();
    }
    getByEmail(email) {
        return userModel.findOne({email});
    }
    getById(id) {
        return userModel.findById(id, {__v: 0, password: 0, createdAt: 0});
    }
}

module.exports = new UserService();