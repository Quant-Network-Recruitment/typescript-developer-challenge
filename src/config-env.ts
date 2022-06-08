import config from 'config';

export const {
  NODE_ENV,
  LOG_LEVEL,
  SERVICE_NAME,
  SERVICE_PORT,
  API_VERSION,
  MONGO,
  DB_NAME,
  RABBIT,
  RABBIT_USERNAME,
  RABBIT_PASSWORD,
  RABBIT_CONFIG,
  TEMPLATE_EXCHANGE
} = config as any;

MONGO.username = process.env.MONGODB_USERNAME ? process.env.MONGODB_USERNAME : "no-user";
MONGO.password = process.env.MONGODB_PASSWORD ? process.env.MONGODB_PASSWORD : "no-password";

MONGO.url =
  NODE_ENV === 'LOCAL'
    ? `mongodb://${MONGO.host}:${MONGO.port}?maxPoolSize=20&w=majority`
    : `mongodb://${MONGO.username}:${MONGO.password}@${MONGO.host}:${MONGO.port}/?authSource=${MONGO.authSource}&authMechanism=SCRAM-SHA-1&maxPoolSize=20&w=majority`;

RABBIT.username = process.env.RABBITMQ_USERNAME
  ? process.env.RABBITMQ_USERNAME
  : 'guest';
RABBIT.password = process.env.RABBITMQ_PASSWORD
  ? process.env.RABBITMQ_PASSWORD
  : 'guest';

RABBIT.config= `amqp://${RABBIT.username}:${RABBIT.password}@${RABBIT.host}:${RABBIT.port}`;

RABBIT.templateExchange = TEMPLATE_EXCHANGE;
