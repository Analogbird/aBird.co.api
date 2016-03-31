'use strict';


module.exports = function errorGenerator (message, code, status) {

	var error = new Error(message || 'Page not found');

	error.status = status || 404;
	error.code = code || 'UPAGE';

	return error;

};
