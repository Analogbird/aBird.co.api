'use strict';


function API() {
	return this;
}

API.prototype.run = function (port) {

	var express = require('express'),
        app = express(),
		compress = require('compression'),
		bodyParser = require('body-parser'),
        favicon = require('serve-favicon'),
        route = require('./route'),
        host = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

    app.use(compress());
    app.use(bodyParser.json());
    app.use(favicon(__dirname + '/public/img/favicon.ico'));
    app.use(function setHeaders (req, res, next) {
        res.setHeader('X-Powered-By', 'Analogbird.com');
        return next();
    });

    route(app);

	app.listen(port, host, function() {
        console.log('API is up. Host %s, port: %d', host, port);
    });

};

var api = new API();
api.run(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8181);
