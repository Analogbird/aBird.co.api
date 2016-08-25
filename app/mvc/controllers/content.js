'use strict';


let m = require('../models'),
    helper = require('./helpers/content');

module.exports = {

    create: (req, res, next) => {

        helper.shrink(req)
            .then(response => res.send(response))
            .catch(error => next(error));
    },

    read: (req, res, next) => {

        m.content.findOneAndUpdate({ mask: req.params.mask, 'meta.status': 'up' }, { $inc: { 'tally.expanded': 1 } })
            .then(record => {
                if (!record) {
                    return next({ code: 10 });
                }

                res.send({
                    type: record.type,
                    value: (record.type === 'url' || record.type === 'img') ? decodeURIComponent(record.value) : record.value,
                    tally: record.tally
                });
            });
    },

    delete: (req, res, next) => {

        m.content.findOneAndUpdate({ mask: req.params.mask, 'meta.status': 'up' }, { 'meta.status': 'down' })
            .then(record => {
                if (!record) {
                    return next({ code: 10 });
                }

                res.status(200).end();
            })
            .catch(error => next(error));
    }
};
