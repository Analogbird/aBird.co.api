'use strict';


module.exports = {
    version: process.env.NODE_ENV,
    privateKey: process.env.PRIVATE_KEY,
    host: process.env.HOST,
    hits: {
        perMinute: process.env.HITS_PER_MINUTE,
        perDay: process.env.HITS_PER_DAY,
        timeOut: process.env.HITS_TIMEOUT
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
        options: {
            auth_pass: process.env.REDIS_PASS || ''
        },
    },
    mongo: {
        url: process.env.MONGO_URL,
        options: {
            db: {
                native_parser: true
            },
            server: {
                poolSize: parseInt(process.env.MONGO_POOL_SIZE) || 10,
                socketOptions: {
                    keepAlive: parseInt(process.env.MONGO_KEEP_ALIVE) || 1
                }
            }
        }
    }
};
