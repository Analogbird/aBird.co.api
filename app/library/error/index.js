'use strict';


let errors = require('./errors.json');

module.exports = (error, req, res, next) => {

    let status = error.status || 404,
        code = error.code || 10;

    res.status(status).send({
        status: status,
        code: code,
        message: errors[status][code] || error.message
    });

    console.log(error);
    error = null;
    next = null;
};
