'use strict';


let validators = require('../../library/validators');

module.exports = (router, control) => {

    router.route('/content/:mask?/:deleteMethod?')
        .post(validators.create, control.create)
        .get(control.read)
        .delete(control.delete);

    return router;
};
