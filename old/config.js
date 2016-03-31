'use strict';


var config = {
	version: '0.1',
	privateKey: 'e01a650bca7f1130ae2086d16cc4c76069e578ce2f16a00b26bbe06b6fb890a4ca7a4512e543d0fc8c5f86788c6fd8dc3c12160338ecd945ab7e7d6e7cf7ce80',
	host: 'http://ab.je/',
	hits: {
		perMinute: 10,
		perDay: 500,
		timeOut: 10
	},
	redis: {
		port: 19574,
		host: 'pub-redis-19574.eu-west-1-1.1.ec2.garantiadata.com',
		options: {
			'auth_pass': '4E7wNK6yNkt02USM'
		}
	},
	mongo: {
        "user": "admin",
        "password": "XDbTpP4p-jmL",
        "host": [
            "54fc8818fcf93329e7000099-abirdco.rhcloud.com:60386"
        ],
        "name": "api",
        "poolSize": 10
    },
	cloudinary: {
		api: '',
		basicUrl: '',
		secureUrl: '',
		cloud: '',
		key: '',
		secret: ''
	}
};

module.exports = config;
