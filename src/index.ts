import express from 'express';
import getLogger from './utils/logger';
import router from './router';
import { SERVICE_PORT, API_VERSION } from './config-env';

const logger = getLogger('index');

const app = express();

app.use(express.json());
app.use(`/${API_VERSION}`, router);

app.listen(SERVICE_PORT, () => {logger.info(`Server started on port ${SERVICE_PORT}`);});