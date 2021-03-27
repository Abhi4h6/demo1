const bcrypt = require('bcrypt');
const userService = require('../services/user.svc');
const constants = require('../constants');
const jwt = require('jsonwebtoken');

class UserCtrl {
    async register(req, res) {
        try {
            const isExist = await userService.getByEmail(req.body.email);
            if (isExist != null) {
                res.status(409);
                res.send({error: 'conflict', errorDescription: 'User already exist'});
            } else {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                const userData = await userService.create(req.body);
                const token = await jwt.sign({
                    userId: userData._id,
                    email: userData.email,
                    mobile: userData.mobile
                }, constants.JWT_SECRET, { expiresIn: '1h' });
                res.status(200);
                res.send({token, status: 'Registered successfully'});
            }
        } catch(error) {
            console.log(error);
            res.send({error});
            res.status(500);
        }
    }
    async login (req, res) {
        try {
            const isUserExist = await userService.getByEmail(req.body.email);
            if (isUserExist != null) {
                const isPwdValid = await bcrypt.compare(req.body.password, isUserExist.password);
                if (isPwdValid) {
                    const token = await jwt.sign({
                        userId: isUserExist._id,
                        email: isUserExist.email,
                        mobile: isUserExist.mobile
                    }, constants.JWT_SECRET, { expiresIn: '1h' });
                    res.status(200);
                    res.send({token, status: 'Logged in successfully'});       
                } else {
                    res.status(409);
                    res.send({error: 'conflict', errorDescription: 'Incorrect password'});
                }
            } else {
                res.status(409);
                res.send({error: 'conflict', errorDescription: 'Incorrect email'});
            }
        } catch(error) {
            console.log(error);
            res.send({error});
            res.status(500);
        }
    }
    async getUser(req, res) {
        try {
            let id = req.params.userId;
            const userdata = await userService.getById(id);
            if (userdata != null) {
                res.status(200);
                res.send({data: userdata, status: 'Retrieved successfully'});
            } else {
                res.status(404);
                res.send({error: 'not-found', errorDescription: 'User not found'});
            }
        } catch(error) {
            console.log(error);
            res.send({error});
            res.status(500);
        }
    }

}

module.exports = new UserCtrl();





