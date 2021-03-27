const constants = require('../constants');

class HealthCheckController {
    health(req, res) {
        res.send({health: 'Server is up on runing'});
        res.status(constants.STATUS_CODES.SUCCESS);
    }
}

module.exports = new HealthCheckController();