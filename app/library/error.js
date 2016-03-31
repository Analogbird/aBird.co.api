'use strict';


var errors = {

    40001: 'The content type does not match our expectations.',
    40002: 'The request has exceeded the time offset.',
    40003: 'The authentication header is not valid.',
    40004: 'The authentication data does not match our expectations.',
    40005: 'The signature is not valid.',
    40006: 'The email is valid, but the password is not.',
    40007: 'The email address is already in use.',
    40008: 'The email address does not match any profile.',
    40009: 'The email address is not valid.',
    40010: 'The password does not match our criteria.',
    40011: 'The provided data could not be successfully validated.',

    40101: 'The provided email is not valid.',
    40102: 'The provided password is not valid.',

    40401: 'We could not find any data to match your request.',

    50001: 'An unidentified data error just occurred.',
    50002: 'The most obscure system error just occurred.'

};

module.exports = function errorHandler (err, req, res, next) {

    var status = err.code ? err.code.toString().substr(0,3) : 404,
        code = err.code || null,
        message = errors[code] || undefined;

    res.status(status);
    if (!code) {
        res.end();
    } else {
        res.send({
            code: code,
            message: message
        });
    }

    next = null;
};