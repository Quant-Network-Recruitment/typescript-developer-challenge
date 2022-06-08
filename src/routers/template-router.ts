import express from 'express';
import { getData, postData } from '../controllers/template-controller';

const router = express.Router();

router.get('/data/:templatePathVariable', getData);
router.post('/data', postData)

export default router;
