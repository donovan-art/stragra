import express from 'express';

const router: express.Router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Billing API' });
});

router.get('/invoices', (req: express.Request, res: express.Response) => {
  res.json({ invoices: [] });
});

export default router;
