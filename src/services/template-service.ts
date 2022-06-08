import getLogger from '../utils/logger';
import TemplateType from '../types/TemplateType';
import TemplateRepository from '../mongo/template-repository';
import { Db, MongoClient } from 'mongodb';
import { MONGO, DB_NAME, RABBIT, TEMPLATE_EXCHANGE, } from '../config-env';
import Amqp from '../rabbit/amqp';
import { Channel, Connection } from 'amqplib';

const logger = getLogger('address-services');

const initializeDb = async (): Promise<Db> => {
    try {
        const url = MONGO.url;
        const client = new MongoClient(url);
        await client.connect();
        return client.db(DB_NAME);
    } catch (error) {
        logger.error('Error starting up mongo');
        throw error;
    }
}

const createChannelAndExchange = async (connection: Connection): Promise<Channel> => {
    const channel = await connection.createChannel();
    await channel.assertExchange(TEMPLATE_EXCHANGE, 'topic', {
        durable: true,
    });
    return channel;
}

const publishData = async (channel: Channel, templateType: TemplateType): Promise<void> => {
    const message = JSON.stringify(templateType);
    const opts = {
        headers: {
            processTime: new Date().valueOf(),
        }
    }
    logger.info('Sending a new message on the Template Exchange: ' + message);
    setTimeout(() => {channel.publish(TEMPLATE_EXCHANGE, '', Buffer.from(message), opts)}, 500);
}


export const getDataFromDatabase = async (
    templateField: string,
): Promise<TemplateType> => {
    logger.info('Calling DB to get data for: ' + templateField);

    return {
        templateField: templateField
    };
};

export const saveDataAndPublishToQueue = async (
    templateField: string,
): Promise<TemplateType> => {
    if (templateField === 'How are you?') {
        templateField = 'Always peachy!'
    }
    logger.info('Saving data ' + templateField + ' to the database.');
    const templateType: TemplateType = {
        templateField: templateField
    }
    const db = await initializeDb();
    const templateRepository: TemplateRepository = new TemplateRepository(db);
    await templateRepository.save(templateType);

    const currentSize = await templateRepository.collection.countDocuments();
    console.log(currentSize);

    if (currentSize == 5) {
        templateField = '42';
    }

    logger.info('Publishing data ' + templateField + ' to the queue.');
    const amqp = new Amqp(RABBIT.config);
    amqp.init(async (connection) => {
        const channel: Channel = await createChannelAndExchange(connection);
        await publishData(channel, templateType);
    });

    return {
        templateField: templateField
    };
};