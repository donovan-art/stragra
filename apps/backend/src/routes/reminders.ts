import express from 'express';
import { processReminderQueue, getQueueStatus, addReminderJob } from '../queue/reminderQueue';

const router: express.Router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Reminders API' });
});

router.get('/queue', (req: express.Request, res: express.Response) => {
  const status = getQueueStatus();
  res.json(status);
});

router.post('/queue/process', (req: express.Request, res: express.Response) => {
  processReminderQueue();
  res.json({ message: 'Queue processed' });
});

router.post('/job', (req: express.Request, res: express.Response) => {
  const job = addReminderJob({
    type: req.body.type || 'default',
    data: req.body.data || {},
    scheduledAt: new Date(req.body.scheduledAt || Date.now())
  });
  res.json(job);
});

export default router;
