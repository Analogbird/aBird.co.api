'use strict';


/*
 * REQUEST middleware.
 * Mainly used for request authentication functionality.
 */

var config = require('../config'),
	error = require('./error'),
	modeler = require('./modeler'),
	redis = require('redis'),
	when = require('when'),
	moment = require('moment');

/**
 * Make sure to return 'true' (success) in case Redis reports an error.
 * It is preferred -in this case- to let the user make an extra request instead of returning an error.
 *
 * @param sessionToken
 * @returns {promise|*|Promise|when.promise}
 */
var checkHits = function request$checkHits (sessionToken) {


	var deferred = when.defer();
	deferred.resolve(1);
	return deferred.promise;


	// Disabled until new tests are conducted on this particular issue.

	var redisClient = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

	redisClient.on('error', function () {
		redisClient.quit();
		deferred.resolve(true);
	});

	redisClient.get(sessionToken, function(err, reply) {

		reply = reply || 1;

		if (!reply) {

			/**
			 * Set the keys to expire at midnight (CET).
			 */
			var tonight = moment().endOf('day').unix(),
				secondsToNight = tonight - moment().unix();

			redisClient.setex(sessionToken, secondsToNight, 1);
		} else if (reply <= config.hits.perDay) {
			redisClient.incr(sessionToken);
		} else if (reply > config.hits.perDay) {
			deferred.resolve(false);
		}

		redisClient.quit();
		deferred.resolve(reply);
	});

	return deferred.promise;
};

module.exports = {

	verifyHeaders : function request$verifyHeaders (req, res, next) {

		if (req.headers['content-type']) {
			req.headers['content-type'] = req.headers['content-type'].toLowerCase();
		}

		if (!(req.headers['content-type'] === 'application/json' ? true : false)) {
			return next(error('Content not acceptable.', 'ICONT', 406));
		}

		return next();
	},

	verifyKey : function request$verifyKey (req, res, next) {

		var key = req.body.key || null;
		if (!key) {
			return next(error('Invalid API key.', 'NKEYP', 403));
		}

		checkHits(key).then(function(hitsMade) {

			res.setHeader('X-Requests-made', hitsMade);
			res.setHeader('X-Requests-left', config.hits.perDay - hitsMade);

			if (!hitsMade) {
				return next(error('Too many requests.', 'UREQS', 403));
			}

			modeler.findOne('bird', { 'meta.key': key }, function (err, bird) {
				if (err) {
					return next(err);
				}

				if (!bird) {
					return next(error('Invalid API key.', 'NKEYP', 403));
				}

				req.currentBird = {
					id: bird.id,
					username: bird.username
				};

				return next();
			});
		});
	}

};
