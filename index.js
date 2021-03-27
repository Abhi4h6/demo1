const express = require('express');
const app = express();
const config = require('./config');
const constants = require('./constants');
const data = require('./data');
const healthCtrl = require('./controllers/healthcheck.ctrl');
// const productCtrl = require('./controllers/products.ctrl');
const productCtrl = require('./controllers/productsPromises.ctrl');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ProductCtrl = require('./controllers/productsPromises.ctrl');
const productRouter = require('./routers/products.router');
const userRouter = require('./routers/user.router');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    console.log(req.url);
    res.send('Welcome to ecommerce rest application');
    res.status(constants.STATUS_CODES.SUCCESS);
});

// app.get('/healthcheck', (req, res) => {
//     res.send({health: 'Server is up on runing'});
//     res.status(constants.STATUS_CODES.SUCCESS);
// });

app.get('/healthcheck', healthCtrl.health);

// app.get('/v1/products', (req, res) => {
//     data.products.forEach( product => {
//         if (product.id === 1001) {
//             product.price = 9999
//         }
//     });
//     res.send({products: data.products});
//     res.status(constants.STATUS_CODES.SUCCESS);
// });

app.use(express.static('uploads'));



app.use('/v1/products/', productRouter);
app.use('/v1/users', userRouter);


app.listen(config.PORT, () => {
    console.log(`Server is up on port no: ${config.PORT}`);
});


mongoose.connect(config.mongodbUri, { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log('db up on runing successfully on port 27017');
    }
});


// for(let i = 0; i < Array.length; i++) {
//     array[i];

//     break;
// }

// arrayName.forEach((currentValue, index, array) => {

// });