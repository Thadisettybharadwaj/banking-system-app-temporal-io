import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 200, message: 'ok' });
});

export default router;
