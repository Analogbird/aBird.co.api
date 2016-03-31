'use strict';


var mongo = require('./mongo'),
    crypto = require('./crypto'),
    auth = {

        session : function auth$session (user, callback) {

            crypto.bytes(256, function(bytes) {
                if (!bytes) {
                    return callback(false);
                }

                bytes += JSON.stringify(user);

                var secretKey = crypto.hmac(bytes),
                    publicKey = crypto.hmac(bytes, 'sha256');

                mongo.save('birdSession',
                    {
                        birdID: user._id,
                        secretKey: secretKey,
                        publicKey: publicKey
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, {
                            userId: user._id,
                            secretKey: secretKey,
                            publicKey: publicKey
                        });
                    }
                );
            });
        },

        login : function auth$login (user, callback) {

            mongo.findOne('bird', { 'email': user.email }, 'id username password meta',
                function (err, record) {
                    if (err) {
                        return callback({ code: 50001 });
                    }

                    if (!record) {
                        return callback({ code: 40101 });
                    }

                    if (crypto.hmac(user.password + record.meta.salt) !== record.password) {
                        return callback({ code: 40102 });
                    }

                    auth.session(record, function(err, session) {
                        if (err) {
                            return callback(err);
                        }

                        return callback(null, session);
                    });
                }
            );
        },

        logout : function auth$logout (user, callback) {

            return callback(200);
        }

    };

module.exports = auth;
