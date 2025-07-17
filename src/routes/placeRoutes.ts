import { Router } from 'express';

const router = Router();

// Stub routes for places of worship
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get places endpoint not yet implemented'
  });
});

router.get('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Get place details endpoint not yet implemented'
  });
});

router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Create place endpoint not yet implemented'
  });
});

export default router;