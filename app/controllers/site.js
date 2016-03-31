'use strict';


module.exports = {

    index : function site$index (req, res) {

        res.status(200).send({
            code: 200,
            message: 'Our service is up and running but there is nothing here.'
        });
    },

    time : function site$time (req, res) {

        res.status(200).send({
            time: Math.round(+new Date() / 1000)
        });
    }

};
