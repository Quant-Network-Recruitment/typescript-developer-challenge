import { Request, Response } from 'express';
import getLogger from '../utils/logger';
import { SERVICE_NAME } from '../config-env';
import { getDataFromDatabase, saveDataAndPublishToQueue } from '../services/template-service';

const logger = getLogger('node-controller');

export const getData = async (req: Request, res: Response) => {
  try {
    logger.info('Received a request to get data: ' + req.params.templatePathVariable);

    const response = await getDataFromDatabase(req.params.templatePathVariable);

    res.status(200).json(response);
  } catch (err: unknown) {
    logger.error('Error: ' + err);
    res.status(500);
  }
};

export const postData = async (req: Request, res: Response) => {
  try {
    logger.info('Received a request to post data: ' + req.body.templateField);

    const response = await saveDataAndPublishToQueue(req.body.templateField);
    logger.info(response);

    res.status(200).json(response);
  } catch (err: unknown) {
    logger.error('Error: ' + err);
    res.status(500);
  }
};
