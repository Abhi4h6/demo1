const middlewares = {
    requestValidator: (req, res, next) => {
        if (req.url === '/create') {
            const mandatoryParams = ['name', 'price', 'inStock', 'category', 'specifications'];
            const missingParams = mandatoryParams.filter((param) => !(req.body[param]));
            if (missingParams.length) {
                res.status(400);
                res.send({error: 'bad_request', errorDescription: `Please fill ${missingParams.join(', ')}`});
            } else {
                if (fieldsValidator(req.body)) {
                    next();
                } else {
                    res.status(400);
                    res.send({error: 'bad_request', errorDescription: `Invalid request`});
                }
            }
        }
    }
}

function fieldsValidator(requestBody){
    let isValid = false;
    if (requestBody['inStock'] && [true, false].includes(requestBody['inStock'])) {
        isValid = true;
    } 
    if (requestBody['category'] && ['Mobiles', 'Laptops', 'Washing Machines'].includes(requestBody['category'])) {
        isValid = true;
    }
    if (requestBody['price'] && Number(requestBody['price']) > 0 && Number(requestBody['price']) < 30000) {
        isValid = true;
    }
    return isValid;
}

module.exports = middlewares;