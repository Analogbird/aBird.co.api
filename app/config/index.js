'use strict';


var config = function config () {

    var configFile = process.env.NODE_ENV || 'local',
        configJSON = require('./_' + configFile);

    return configJSON;
};

module.exports = config();
