
import express from 'express';

const router = express.Router();

// GET all products
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'All products retrieved successfully'
  });
});

export default router;
