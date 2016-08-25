'use strict';


let config = require('../../../config'),
    m = require('../../models'),
    validator = require('validator'),
    process = (data, unescapedUrl) => {

        return new Promise((yes, no) => {

            m.content.aggregate([ { $group: { _id: null, count: { $sum: 1 } } }] )
                .then(aggregation => {

                    let currentCount = aggregation[0] ? aggregation[0].count + 1 : 1;
                    data.mask = data.mask || currentCount.toString(36);
                    return m.content.create(data);
                })
                .then(record => yes(response(record, data.value, unescapedUrl)))
                .catch(error => no(error));
        });
    },
    response = (record, input, unescapedUrl) => {

        let url = config.host.concat(record.mask);
        return {
            mask: record.mask,
            url: url,
            shrank: {
                chars: (unescapedUrl || input).length - url.length,
                percent: (100 - ((url.length * 100 ) / (unescapedUrl || input).length)).toFixed(2)
            }
        }
    };


module.exports = {

    shrink: req => {

        return new Promise((yes, no) => {

            let data = {
                type: req.body.type,
                value: null,
                mask: req.body.mask || null,
                public: req.body.public !== false,
                source: req.body.source || null
            };

            if (req.body.type === 'text') {
                data.value = validator.escape(req.body.value.trim());
                if (!data.value) {
                    return no({ status: 400, code: 10 });
                }

                return process(data)
                    .then(response => yes(response))
                    .catch(error => no(error));
            }

            data.value = req.body.value.replace(/\/$/, '').trim();
            if (data.value.indexOf('http') !== 0) {
                data.value = 'http://'.concat(value);
            }

            if (!validator.isURL(data.value)) {
                return no({ status: 400, code: 11 });
            }

            let unescapedUrl = data.value;
            data.value = encodeURIComponent(data.value);
            m.content.findOneAndUpdate({ value: data.value }, { $inc: { 'tally.shrunken': 1 } })
                .then(record => {
                    if (!record) {
                        return process(data, unescapedUrl);
                    }

                    yes(response(record, data.value, unescapedUrl));
                })
                .then(response => yes(response))
                .catch(error => no(error));
        });
    },

    response: response
};
