'use strict';


var config = require('../config'),
	mongoose = require('mongoose'),
    mongo = {

        connect : function mongoose$connect () {

            if (this.connection) {
                return this;
            }

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
            this.connection = mongoose;
            return this;
        },

        model : function mongo$model (requiredModel, callback, self) {

            var modelSchema = require('../models/'.concat(requiredModel)),
                ModelObject = this.connection.model(requiredModel, modelSchema);

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

        save : function mongo$save (requiredModel, data, callback) {

            this.model(requiredModel, function(model) {

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

        delete : function mongo$delete (requiredModel, record, callback) {

            var query = { 'data.mask': record.mask, 'meta.status.deleted': 'no' },
                update = { 'meta.status.date': Date.now(), 'meta.status.deleted': record.type };

            this.model(requiredModel, function(model) {
                model.findOneAndUpdate(query, update, callback);
            }, true);
        },

        findOneAndUpdate : function mongo$findOneAndUpdate (requiredModel, query, update, callback) {

            this.model(requiredModel, function(model) {
                model.findOneAndUpdate(query, update, callback);
            }, true);

        },

        findOne : function mongo$findOne (requiredModel, query, fields, callback) {

            this.model(requiredModel, function(model) {
                model.findOne(query, fields, callback);
            }, true);

        }
    };

module.exports = mongo.connect();