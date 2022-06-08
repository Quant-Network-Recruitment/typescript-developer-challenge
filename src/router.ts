import express from 'express';
import templateRouter from './routers/template-router';

const router = express.Router();

router.use('/template', templateRouter);

export default router;
