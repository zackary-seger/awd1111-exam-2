import Debug from 'debug';
const debugMain = Debug('app:routes:user');
import * as dbModule from '../../database.js';
import express from 'express';
import Joi from 'joi';
import { validId } from '../../middleware/validId.js';
import { validBody } from '../../middleware/validBody.js';

// Create Router
const router = express.Router();

// Define joi validation schemas
const newProductSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  category: Joi.string().min(1).trim().required(),
  price: Joi.string().min(1).trim().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().trim(),
  category: Joi.string().min(1).trim(),
  price: Joi.string().min(1).trim(),
}).min(1);

// Register Routes
router.get('/list', async (req, res, next) => {
  // Get products array and send response as JSON
  try {
    const products = await dbModule.findAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ error: 'Products Not Found..'});
    next(err);
  }
});

router.get('/id/:productId', validId('productId'), async (req, res, next) => {
 // Get product from products array and send response as JSON
 const productId = req.productId;
 
 try {

 const foundProduct = await dbModule.findProductById(dbModule.newId(productId));
 res.json(foundProduct);

 } catch (err) {
  res.status(404).json({ error: `Product: ${productId} not found..`})
 }

});

router.put('/new', validBody(newProductSchema), async (req, res, next) => {
  // Create new product and send response as JSON

  const { name,
          description,
          category,
          price } = req.body;

  const newProduct =  {
    name,
    description,
    category,
    price
  }

  try {
    
    await dbModule.insertOneProduct(newProduct);

    try {

      const foundProduct = await dbModule.findProductByProductName(name);
      const productId = foundProduct._id;
      res.status(200).json({ message: `Product: ${productId} inserted!..`})
     
      } catch (err) {
       res.status(404).json({ error: `Product: ${productId} not found..`})
      }

  } catch (err) {

    res.status(400).json({ error: 'Product Not Inserted..'});
    next(err);
    
  }

});

router.put('/:productId', validId('productId'), validBody(updateProductSchema), async (req, res, next) => {
  // Update existing product and send response as JSON;
  const productId = req.productId;
  const updateProduct = req.body;

  if (!updateProduct) {
    res.status(404).json({ error: 'product Not Found'});
  } else {

    try {

      await dbModule.updateOneProduct(productId, updateProduct);
      res.status(200).json({message: `Product: ${productId} updated!`});

    } catch (err) {
      res.status(400).json({ error: `Product: ${productId} Not Updated..`});
    }

  } 
});

router.delete('/:productId', validId('productId'), async (req, res, next) => {
  // Delete product and send response as JSON;
  const productId = req.productId;

  try {
    
    await dbModule.deleteOneProduct(productId);
    res.status(200).json({message:`Product: ${productId} deleted!`});

  } catch (err) {

    res.status(400).json({ error: 'Product Not Deleted..'});
    next(err);
    
  }

});
 
// Export Router
export {router as productRouter};