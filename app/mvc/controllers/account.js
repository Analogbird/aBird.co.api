'use strict';


var config = require('../config'),
	mongo = require('../library/mongo'),
    auth = require('../library/auth');

module.exports = {

    login : function account$login (req, res, next) {

		var user = {
            email: req.body.email || null,
            password: req.body.password || null
        };

        auth.login(user, function (err, session) {
            if (err) {
                return next(err);
            }

            res.send(session);
        });
	},

    logout : function account$logout (req, res, next) {

		res.status(200).end();
	},

    create : function account$create (req, res, next) {

		res.status(200).end();
	},

    read : function account$read (req, res, next) {

        res.status(200).end();
	},

	update : function account$update (req, res, next) {

        res.status(200).end();
	},

	delete : function account$delete (req, res, next) {

        res.status(200).end();
	}

};
