import { Router } from 'express';

const router = Router();

// Stub route - implement actual functionality
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'bookingRoutes.ts endpoints not yet implemented'
  });
});

export default router;
