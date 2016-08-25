'use strict';


module.exports = (router, control) => {

    router.get('/', control.index);
    router.get('/time', control.time);

    return router;
};
