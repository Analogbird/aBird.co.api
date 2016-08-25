'use strict';


let Jay = require('jayschema'),
    jays = new Jay(),
    validator = require('validator'),
    validate = {

        headers: req => {

            return new Promise((yes, no) => {
                if (!req.is('application/json')) {
                    return no({ status: 400, code: 10 });
                }

                yes();
            });
        },

        content: req => {

            const schema = require('./schemas/content/create.json');
            return new Promise((yes, no) => {
                jays.validate(req.body, schema, function (err) {
                    if (err) {
                        return no({ status: 400, code: 10 });
                    }

                    yes();
                });
            });
        }
    };

module.exports = {

    create: (req, res, next) => {

        validate.headers(req)
            .then(() => validate.content(req))
            .then(() => {
                if (req.body.source) {
                    for (let src in req.body.source) {
                        if (req.body.source.hasOwnProperty(src)) {
                            if (src === 'url') {
                                req.body.source[src] = encodeURIComponent(validator.escape(req.body.source[src]));
                            } else {
                                req.body.source[src] = validator.escape(req.body.source[src]);
                            }
                        }
                    }
                }

                if (req.body.mask) {
                    req.body.mask = req.body.mask.replace(/\W/ig, '');
                }

                next();
            })
            .catch(error => next(error));
    }
};
