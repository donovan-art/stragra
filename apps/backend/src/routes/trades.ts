import express from 'express';

const router: express.Router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({ trades: ['Electrician', 'Plumber', 'Painter', 'HVAC', 'Roofing', 'Concrete', 'Flooring', 'Drywall'] });
});

export default router;
