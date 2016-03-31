'use strict';

/*
 * CONTENT model.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	urlSchema = new Schema(
		{
			birdID : {
				type: Schema.Types.ObjectId,
				ref: 'bird'
			},
			data: {
				mime: {
					type: String,
					default: 'uri',
					required: true
				},
				value: {
					type: String,
					required: true,
					trim: true
				},
				mask: {
					type: String,
					trim: true,
					index: { unique: true }
				}
			},
			meta : {
				source: {
					url: { type: String },
					title: { type: String },
					favicon: { type: String }
				},
				stats: {
					public: { type: Boolean, default: true },
					shrunken: { type: Number, default: 1 },
					expanded: { type: Number, default: 0 }
				},
				created: {
					type: Date,
					default: Date.now
				},
				status: {
					deleted: {
						type: Boolean,
						default: false
					},
					date: { type: Date }
				}
			}
		},
		{
			strict: true,
			versionKey: false
		}
	);


urlSchema.statics = {

};

module.exports = urlSchema;
