'use strict';


var config = require('../config'),
	error = require('../library/error'),
	mongo = require('../library/mongo'),
	validator = require('validator'),
	underscore = require('underscore'),
	shrinkURL = function content$shrinkURL (req, res, next, type) {

		var url = req.body.data.value.replace(/\/$/, '').trim(),
			urlLenght = url.length,
			customMask = (req.body.data.mask || '').replace(/\W/g, '');

		if (url.indexOf('http') !== 0) {
			url = 'http://'.concat(url);
		}

		if (validator.isURL(url)) {

			url = encodeURIComponent(validator.escape(url));

			/**
			 * Try to find the URL being shrunken.
			 * If it exists then increment the "shrunken" counter and return the object, if not
			 * then process normally.
			 */
			mongo.findOneAndUpdate('content',
				{ 'data.value': url },
				{ $inc: { 'meta.stats.shrunken': 1 } },
				function (err, record) {
					if (err) {
						return next(err);
					}

					if (!record) {

						mongo.save('content', {
								birdID: req.currentBird.id,
								'data.mime': type,
								'data.value': url,
								'data.mask': validator.escape(customMask) || { run: true, fromModel: { value: 'count', 'do': 'inc', base: 36 } },
								'meta.stats': {
									public: (req.body.public === false) ? false : true,
									shrunken: 1,
									expanded: 0
								}
							}, function (err, record) {

								if (err && err.code === 11000) {
									return next(error('Mask already in use.', 'UMSKU', 409));
								}

								if (err) {
									return next(err);
								}

								var output = config.host.concat(record.data.mask);
								res.send({
									mask: record.data.mask,
									url: output,
									shrank: {
										chars: urlLenght - output.length,
										percent: (100 - ((output.length * 100 ) / urlLenght)).toFixed(2)
									}
								});
							}
						);

					} else {

						setTimeout(function() {

							if (!req.timedout) {
								var output = config.host.concat(record.data.mask);
								res.send({
									mask: record.data.mask,
									url: output,
									shrank: {
										chars: urlLenght - output.length,
										percent: (100 - ((output.length * 100 ) / urlLenght)).toFixed(2)
									}
								});
							}

						}, 100);

					}
				}
			);

		} else {
			return next(error('Invalid URL.', 'IURLS'));
		}

	},
	shrinkTXT = function content$processTxt (req, res, next) {

		var text = req.body.data.value.trim(),
			source = req.body.meta || {},
			customMask = (req.body.data.mask || '').replace(/\W/g, '');

		if (!text) {
			return next(error('Invalid text.', 'ITXTS'));
		}

		// Validate/sanitize the source
		for (var src in source) {
			if (source.hasOwnProperty(src)) {
				source[src] = validator.escape(source[src]);
			}
		}

		mongo.save('content', {
				birdID: req.currentBird.id,
				'data.mime': 'txt',
				'data.value': validator.escape(text.replace(/\s\s/g, "\r\n")),
				'data.mask': validator.escape(customMask) || { run: true, fromModel: { value: 'count', 'do': 'inc', base: 36 } },
				'meta.source': source,
				'meta.stats': {
					public: (req.body.public === false) ? false : true,
					shrunken: 1,
					expanded: 0
				}
			}, function (err, record) {

				if (err && err.code === 11000) {
					return next(error('Mask already in use.', 'UMSKT', 409));
				}

				if (err) {
					return next(err);
				}

				var output = config.host.concat(record.data.mask);
				res.send({
					mask: record.data.mask,
					url: output,
					shrank: {
						chars: text.length - output.length,
						percent: (100 - ((output.length * 100 ) / text.length)).toFixed(2)
					}
				});
			}
		);

	};


module.exports = {

	create : function content$create (req, res, next) {

		switch (req.body.data.type) {
			case 'txt': shrinkTXT(req, res, next);
				break;

			case 'img': shrinkURL(req, res, next, 'img');
				break;

			case 'url': shrinkURL(req, res, next, 'url');
				break;
		}

		return true;
	},

	delete : function content$delete (req, res, next) {

		if (validator.isAlphanumeric(req.body.mask)) {

			mongo.delete('content', {
					mask: req.body.mask,
					type: (req.body.type && req.body.type === 'hard') ? 'hard' : 'soft'
				}, function (err) {
					if (err) {
						return next(err);
					}

					res.status(200).end();
				}
			);

		} else {
			return next(error('Invalid URL.', 'IURLD'));
		}

		return true;
	},

	read : function content$read (req, res, next) {

		if (validator.isAlphanumeric(req.params.mask)) {

			mongo.findOneAndUpdate('content',
				{ 'data.mask': req.params.mask, 'meta.status.deleted': 'no' },
				{ $inc: { 'meta.stats.expanded': 1 } },
				function (err, record) {
					if (err) {
						return next(err);
					}

					if (!record) {
						return next(error('Invalid URL.', 'IURLE'));
					}

					var response = {
						type: record.data.mime,
						value: decodeURIComponent(record.data.value),
						meta: {
							expanded: {
								chars: record.data.value.length - (config.host + record.data.mask).length,
								percent: (100 - (((config.host + record.data.mask).length * 100 ) / record.data.value.length)).toFixed(2)
							}
						}
					};

					if (!underscore.isEmpty(record.meta.source.toObject())) {
						response.meta.source = record.meta.source.toObject();
					}

					if (record.meta.stats.public) {
						response.meta.stats = {
							expanded: record.meta.stats.expanded,
							shrunken: record.meta.stats.shrunken
						};
					}

					res.send(response);
				}
			);

		} else {
			return next(error('Invalid URL.', 'IURLE'));
		}

		return true;
	},

	stats : function content$stats (req, res, next) {

		if (validator.isAlphanumeric(req.params.mask)) {

			mongo.findOne('content',
				{ 'data.mask': req.params.mask, 'meta.status.deleted': 'no', 'meta.stats.public': true },
				'meta.stats',
				function (err, record) {
					if (err) {
						return next(err);
					}

					if (!record) {
						return next(error('Invalid URL.', 'IURLST'));
					}

					record.meta.stats.public = undefined;
					res.send(record.meta.stats);
				}
			);

		} else {
			return next(error('Invalid URL.', 'IURLST'));
		}

		return true;
	}

};