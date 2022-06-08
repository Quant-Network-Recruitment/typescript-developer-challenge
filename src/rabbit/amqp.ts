import amqplib from 'amqplib/callback_api';
import log4js from 'log4js';
import { Connection } from 'amqplib';

const log = log4js.getLogger('RabbitMQ');
class Amqp {
  config;
  amqp: Connection | undefined;
  offlinePubQueue = [];

  constructor(config: string) {
    log.info('Config: ', config);
    this.config = config;
  }

  init(cb: (connection: Connection) => void): void {
    log.info('Initializing...');
    amqplib.connect(this.config, (error, connection) => {
      if (error) {
        log.error(error.message);
      }
      connection.on('error', (error) => {
        if (error.message !== 'Connection closing...') {
          log.error('Connection error: ', error.message);
        }
      });
      connection.on('close', () => {
        log.error('Reconnecting...');
        setTimeout(() => {
          this.init(cb);
        }, 10000);
      });
      this.amqp = <Connection>connection;
      log.info('Connected to RabbitMQ.');
      cb(<Connection>connection);
    });
  }

  closeOnErr(err: Error) {
    if (!err) return false;
    console.error('[AMQP] error', err);
    if (this.amqp) {
      this.amqp.close();
    }
    return true;
  }
}

export default Amqp;
