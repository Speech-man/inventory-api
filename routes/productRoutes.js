
import express from 'express';

// Import product service functions
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getOutOfStockProducts
} from '../services/productService.js';

// Import validation middleware
import {
  validateCreate,
  validateUpdate
} from '../middleware/validate.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      success: true,
      message: 'All products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products'
    });
  }
});


// GET - Retrieve low-stock products
router.get('/low-stock', async (req, res) => {
  try {
    const products = await getLowStockProducts();

    res.status(200).json({
      success: true,
      message: 'Low-stock products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve low-stock products'
    });
  }
});



// GET - Retrieve out-of-stock products
router.get('/out-of-stock', async (req, res) => {
  try {
    const products = await getOutOfStockProducts();

    res.status(200).json({
      success: true,
      message: 'Out-of-stock products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve out-of-stock products'
    });
  }
});


// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    // Get the ID from the URL
    const { id } = req.params;

    // Find the product using the service function
    const product = await getProductById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Return the product
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product'
    });
  }
});


// POST - Create a new product
router.post('/', validateCreate, async (req, res) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});


// PUT - Update an existing product
router.put('/:id', validateUpdate, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await updateProduct(id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});


// DELETE - Remove a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});


export default router;
