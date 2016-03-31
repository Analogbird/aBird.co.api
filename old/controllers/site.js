'use strict';


var path = require('path'),
	error = require('../library/error');

module.exports = {

	index : function site$index (req, res, next) {

        res.status(200).send({
            code: 200,
            message: 'Our service is up and running but there is nothing here.'
        });

	},

	doc : function site$doc (req, res, next) {

		res.sendfile(path.resolve(__dirname + '/../public/doc.v2.html'));

	}

};
