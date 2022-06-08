import { configure, getLogger as logger } from 'log4js';

const getLogger = (category: string) => {
    configure({
        appenders: {
            console: {
                type: 'console',
            },
        },
        categories: {
            default: {
                appenders: ['console'],
                level: process.env.LOG_LEVEL as string || 'info',
            },
        },
    });
    return logger(category);
};

export default getLogger;
