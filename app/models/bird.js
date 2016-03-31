'use strict';

/*
 * Bird model.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	birdSchema = new Schema(
		{
			username : {
				type: String,
				trim: true,
				index: { unique: true },
				required: true
			},
			email : {
				type: String,
				trim: true,
				index: { unique: true },
				required: true
			},
			password : {
				type: String,
				trim: false,
				required: true
			},
			meta : {
				created: {
					type: Date,
					default: Date.now
				},
				status: {
					type: String,
					default: 'up'
				},
				salt: {
					type: String,
					trim: true
				}
			}
		},
		{
			strict: true,
			versionKey: false
		}
	);

birdSchema.statics = {

};

module.exports = birdSchema;
