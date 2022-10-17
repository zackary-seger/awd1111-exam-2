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
  try {
    const products = await dbModule.findAllProducts();
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ error: 'Products Not Found..'});
    next(err);
  }
});

router.get('/id/:productId', validId('productId'), async (req, res, next) => {
 // Get bugs from bugs array and send response as JSON;
 const productId = req.productId;
 const foundProduct = await dbModule.findProductById(dbModule.newId(productId));
 if (!foundProduct){
  res.status(404).json({ error: `Product: ${productId} not found..`})
 } else {
  res.json(foundProduct);
 }
});

router.put('/new', validBody(newProductSchema), async (req, res, next) => {
  // Create new bug and send response as JSON

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
    res.status(200).json({ message: `Product inserted!..`})

  } catch (err) {

    res.status(400).json({ error: 'Product Not Inserted..'});
    next(err);
    
  }

});

router.put('/:productId', validId('productId'), validBody(updateProductSchema), async (req, res, next) => {
  // Update existing bug and send response as JSON;
  const productId = req.productId;
  const updateProduct = req.body;

  if (!updateProduct) {
    res.status(404).json({ error: 'product Not Found'});
  } else {
    await dbModule.updateOneProduct(productId, updateProduct);
    res.status(200).json({message: `Product: ${productId} updated!`});
  } 
});

router.delete('/:productId', validId('productId'), async (req, res, next) => {
  // Close bug and send response as JSON;
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