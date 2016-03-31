'use strict';

/*
 * Bird session model.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
	birdSessionSchema = new Schema(
		{
            birdID : {
				type: Schema.Types.ObjectId,
				ref: 'bird'
			},
			publicKey : {
				type: String,
				trim: true,
				required: true
			},
			secretKey : {
				type: String,
				trim: true,
				required: true
			},
			meta : {
				created: {
					type: Date,
					default: Date.now
				}
			}
		},
		{
			strict: true,
			versionKey: false
		}
	);

birdSessionSchema.statics = {

};

module.exports = birdSessionSchema;
