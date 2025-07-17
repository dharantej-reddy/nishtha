import { Router } from 'express';

const router = Router();

// Stub route - implement actual functionality
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'videoRoutes.ts endpoints not yet implemented'
  });
});

export default router;
