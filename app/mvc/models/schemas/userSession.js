'use strict';


module.exports = mongoose => {

	let Schema = mongoose.Schema,
		schema = new Schema(
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                publicKey: {
                    type: String,
                    trim: true,
                    required: true
                },
                secretKey: {
                    type: String,
                    trim: true,
                    required: true
                },
                meta: {
                    createdOn: {
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

	return mongoose.model('UserSession', schema, 'userSessions');
};