'use strict';

'use strict';


module.exports = mongoose => {

	let Schema = mongoose.Schema,
		schema = new Schema(
			{
				username: {
					type: String,
					trim: true,
					default: ''
				},
				email: {
					type: String,
					trim: true,
					required: true
				},
				password: {
					type: String,
					trim: false,
					required: true
				},
				meta: {
                    status: {
                        type: String,
                        default: 'active'
                    },
					createdOn: {
						type: Date,
						default: Date.now
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

	return mongoose.model('User', schema, 'users');
};
