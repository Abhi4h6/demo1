const express = require('express');
const router = express.Router();
// const productsCtrl = require('../controllers/productsPromises.ctrl');
const productsCtrl = require('../controllers/productsAsyncAwait.ctrl');
const middlewares = require('../middlewares');
const multer = require('multer');
const path = require('path');
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
const uploadImage = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if(['.png', '.jpg', '.gif', '.jpeg'].includes(ext) === false) {
            return cb(new Error('Only png, jpg and gif formats are allowed'));
        }
        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }
});

router.post('/createOrUpdate', productsCtrl.createOrUpdate);
router.get('/pagination/:pageIndex/:pageSize/:direction/:sort', productsCtrl.byPagination);
router.get('/', productsCtrl.get);
router.post('/create', uploadImage.single('image'), middlewares.requestValidator, productsCtrl.create);
router.get('/:id', productsCtrl.getById);
router.put('/:id', productsCtrl.update);
router.delete('/:id', productsCtrl.delete);
//
module.exports = router;