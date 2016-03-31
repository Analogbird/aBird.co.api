'use strict';


var config = require('../config'),
	mongoose = require('mongoose');

module.exports = (function mongoose$connect () {

	mongoose.connect('mongodb://'.concat(config.mongo.host.join(','), '/', config.mongo.name), {
		db: { native_parser: true },
		server: {
			poolSize: config.mongo.poolSize,
			socketOptions: {
				keepAlive: 1
			}
		},
		user: config.mongo.user,
		pass: config.mongo.password
	});
	
	// TODO: Implement error checks.
	
	return mongoose;

}());
