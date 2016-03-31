'use strict';


function API() {
	return this;
}

API.prototype.run = function (port) {

	var express = require('express'),
		compress = require('compression'),
		bodyParser = require('body-parser'),
        favicon = require('serve-favicon'),
		ninja = require('route.ninja').with(express, __dirname).timeout('3s'),
        host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

    port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || port;

	ninja.use(
		compress(),
		bodyParser.json(),
        favicon(__dirname + '/public/img/favicon.ico'),
		function setHeaders (req, res, next) {
			res.setHeader('X-Powered-By', 'Analogbird.com');
			return next();
		},
		function errorHandler (err, req, res, next) {
			var message = JSON.parse(JSON.stringify(err.message, ['message']));
			res.status(err.status || 404).send({
				status: err.status || 404,
				code: err.code || '',
				message: message || ''
			});
		}
	);

	ninja.listen(port, host);
	console.log('API is up. Port: %d', port);

};

var api = new API();
api.run(8181);
