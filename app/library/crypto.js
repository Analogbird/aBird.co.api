'use strict';


var config = require('../config'),
    crypto = require('crypto'),
    vault = {

        setKey : function crypto$useKey (key) {

            this.key = key || config.privateKey;
            return this;
        },

        bytes : function crypto$bytes (length, callback, encode) {

            encode = encode || 'hex';
            if (!callback) {
                return crypto.randomBytes(length).toString(encode);
            }

            crypto.randomBytes(length, function(err, bytes) {
                if (err) {
                    callback(null);
                }

                return callback(bytes.toString(encode));
            });

        },

        hmac : function crypto$hmac (data, hash, encode) {

            var key = this.key || config.privateKey;

            hash = hash || 'sha512';
            encode = encode || 'hex';

            return crypto.createHmac(hash, key).update(data).digest(encode);
        },

        hash : function crypto$hash (data, hash, encode) {

            hash = hash || 'sha512';
            encode = encode || 'hex';

            return crypto.createHash(hash).update(data, 'utf8').digest(encode);
        }

    };

module.exports = vault;
