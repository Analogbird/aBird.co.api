'use strict';


module.exports = mongoose => {

    let Schema = mongoose.Schema,
        schema = new Schema(
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User'
                },
                type: {
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
                    trim: true
                },
                public: {
                    type: Boolean,
                    default: true
                },
                tally: {
                    shrunken: {
                        type: Number,
                        default: 1
                    },
                    expanded: {
                        type: Number,
                        default: 0
                    }
                },
                source: {
                    url: {
                        type: String,
                        trim: true
                    },
                    title: {
                        type: String,
                        trim: true
                    },
                    favicon: {
                        type: String,
                        trim: true
                    }
                },
                meta: {
                    status: {
                        type: String,
                        default: 'up'
                    },
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

    return mongoose.model('Content', schema, 'contents');
};
