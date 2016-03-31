'use strict';


var account = require('./controllers/account'),
    content = require('./controllers/content'),
    site = require('./controllers/site'),
    validate = require('./library/validate'),
    error = require('./library/error');

module.exports = function (app) {

    app.get('/', site.index);
    app.get('/1.0/time', site.time);


    /**
     * Authentication
     */
    app.route('/1.0/auth')
        .post(validate.general.headers, validate.general.login, account.login)
        .delete(validate.general.signature, account.logout);


    /**
     * Accounts
     */
    app.route('/1.0/account/:accountId?')
        .post(validate.general.headers, validate.general.signature, validate.account.create, account.create)
        .get(validate.general.signature, account.read)
        .put(validate.general.headers, validate.general.signature, validate.account.update, account.update)
        .delete(validate.general.headers, validate.general.signature, account.delete);


    /**
     * Content
     */
    app.route('/1.0/content/:mask?')
        .post(validate.general.headers, validate.general.signature, validate.content.create, content.create)
        .get(content.read)
        .delete(validate.general.signature, content.delete);
    app.get('/1.0/content/:mask/stats', content.stats);


    app.use(error);
};
