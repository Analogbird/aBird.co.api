'use strict';


var mongo = require('../library/mongoose');

module.exports = {

	load : function modeler$load (requiredModel, callback, self) {

		var modelSchema = require('../models/'.concat(requiredModel)),
			ModelObject = mongo.model(requiredModel, modelSchema);

		if (self) {
			callback(ModelObject);
		} else {

			/**
			 * Use "aggregate" instead of "count" to prevent possible issues when counting
			 * documents in a cluster.
			 * See: http://docs.mongodb.org/manual/reference/method/db.collection.count/
			 */
			ModelObject.aggregate([{ $group: { _id: null, count: { $sum: 1 }}}], function(err, cursor) {
				var model = new ModelObject();
				model.currentCount = (cursor[0]) ? cursor[0].count : 0;

				callback(model);
			});

		}

	},

	save : function modeler$save (requiredModel, data, callback) {

		this.load(requiredModel, function(model) {

			for (var field in data) {
				if (data.hasOwnProperty(field)) {

					var newValue,
						fields;

					if (typeof data[field] === 'object' && data[field].run) {
						if (!data[field].fromModel) {
							model[field] = data[field];
						} else {
							newValue = (data[field].fromModel.value === 'count') ? model.currentCount : 0;
							newValue = (data[field].fromModel.do === 'inc') ? newValue+1 : newValue;
							newValue = newValue.toString(data[field].fromModel.base);
						}
					} else {
						newValue = data[field];
					}

					if (field.indexOf('.') > -1) {
						fields = field.split('.');
						model[fields[0]][fields[1]] = newValue;
					} else {
						model[field] = newValue;
					}
				}
			}

			model.save(callback);
		});
	},

	delete : function modeler$delete (requiredModel, record, callback) {

		var query = { 'data.mask': record.mask, 'meta.status.deleted': 'no' },
			update = { 'meta.status.date': Date.now(), 'meta.status.deleted': record.type };

		this.load(requiredModel, function(model) {
			model.findOneAndUpdate(query, update, callback);
		}, true);
	},

	findOneAndUpdate : function modeler$findOneAndUpdate (requiredModel, query, update, callback) {

		this.load(requiredModel, function(model) {
			model.findOneAndUpdate(query, update, callback);
		}, true);

	},

	findOne : function modeler$findOne (requiredModel, query, fields, callback) {

		this.load(requiredModel, function(model) {
			model.findOne(query, fields, callback);
		}, true);

	}

};
