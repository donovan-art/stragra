import express from 'express';
import billingRouter from './billing';
import remindersRouter from './reminders';
import tradesRouter from './trades';

const router: express.Router = express.Router();

router.use('/billing', billingRouter);
router.use('/reminders', remindersRouter);
router.use('/trades', tradesRouter);

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'API v1', version: '1.0.0' });
});

export default router;
