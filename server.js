
import express from 'express';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Inventory API running' });
});

// Product routes
app.use('/resources', productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
