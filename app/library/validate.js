'use strict';


var util = require('util'),
    Jay = require('jayschema'),
    config = require('../config'),
    crypto = require('./crypto'),
    mongo = require('./mongo').connect(),
    jays = new Jay(),
    validate = {

        general: {

            headers : function validate$headers (req, res, next) {

                if (!req.is('application/json')) {
                    return next({ code: 40011 });
                }

                return next();
            },

            login : function validate$login (req, res, next) {

                var schema = require('./schemas/account/login.json');
                jays.validate(req.body, schema, function (err) {
                    if (err) {
                        return next({ code: 40011 });
                    }

                    if (req.body.password.length !== 64) {
                        return next({ code: 40010 });
                    }

                    return next();
                });
            },

            signature : function validate$signature (req, res, next) {

                if (!req.get('x-abird') || req.get('x-abird').length !== 138) {
                    return next({ code: 40003 });
                }

                var client = {
                        signature: req.get('x-abird').slice(0, 64),
                        token: req.get('x-abird').slice(64, 128),
                        timestamp: req.get('x-abird').slice(128)
                    },
                    serverTime = Math.round(+new Date() / 1000);

                if ((serverTime - config.hits.timeOut) > client.timestamp) {
                    return next({ code: 40002 });
                }

                /**
                 * If, at some point, session can be marked as unavailable but not be deleted, then the DB function
                 * should consider also checking if meta::json->'status' = 'active'. This is currently not on the list
                 * but it's good to keep a reference to it.
                 */
                db.query('SELECT "1_DNTN_Session_Read"($1) AS session', [client.token], function (err, result) {
                    if (err) {
                        return next({ err:500 });
                    }

                    if (!result.session) {
                        return next({ err:403, code:100003 });
                    }

                    var loadToHash = (!lodash.isEmpty(req.body)) ? JSON.stringify(req.body) : req.path,
                        loadMD5 = crypto.hash(loadToHash, 'md5'),
                        signString = util.format('%s\n%s\n%s\n%s', req.method, req.path, loadMD5, client.timestamp),
                        signature = crypto.setKey(result.session.key).hmac(signString, 'sha256');

                    if (signature === client.signature) {
                        req.currentUser = {
                            id: result.session.user_id,
                            token: client.token,
                            type: result.session.type,
                            stripeId: result.session.stripeId,
                            email: result.session.email,
                            name: result.session.name
                        };

                        crypto.setKey();
                        return next();
                    }

                    crypto.setKey();
                    return next({ err:403, code:100001 });
                });
            }

        },

        account : {

            create : function validate$account$create (req, res, next) {

                var schema = require('./schemas/account/create.json');
                jays.validate(req.body, schema, function (err) {
                    if (err) {
                        return next({ code: 40011 });
                    }

                    return next();
                });
            },

            update : function validate$account$update (req, res, next) {

                var schema = require('./schemas/account/update.json');
                jays.validate(req.body, schema, function (err) {
                    if (err) {
                        return next({ code: 40011 });
                    }

                    return next();
                });
            }
        },

        content : {

            create : function validate$content$create (req, res, next) {

                var schema = require('./schemas/content/create.json');
                jays.validate(req.body, schema, function (err) {
                    if (err) {
                        return next({ code: 40011 });
                    }

                    return next();
                });
            }
        }

    };

module.exports = validate;
