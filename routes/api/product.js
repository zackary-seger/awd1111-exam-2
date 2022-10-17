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

const updateBugSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  reproductionSteps: Joi.string().min(1).trim(),
  classification: Joi.string().min(1).trim(),
  closed: Joi.bool(),
}).min(1);

const classifySchema = Joi.object({
  classification: Joi.string().trim().required(),
});

const assignSchema = Joi.object({
  assignedToUserId: Joi.string().trim(),
});

const newTestCaseSchema = Joi.object({
  bugTestCase: Joi.string().required()
});

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

router.put('/:bugId', validId('bugId'), validBody(updateBugSchema), async (req, res, next) => {
  // Update existing bug and send response as JSON;
  const bugId = req.bugId;
  const updateBug = req.body;

  if (!updateBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    debugMain(updateBug);
    await dbModule.updateOneBug(bugId, updateBug);
    res.status(200).json({message: `Bug ${bugId} updated!`});
  } 
});

router.put('/:bugId/classify', validId('bugId'), validBody(classifySchema), async (req, res, next) => {
  // Classify bug and send response as JSON;
  const bugId = req.bugId;
  const classification = req.body;
  const foundBug = req.body;
  debugMain(foundBug);

  console.log(bugId);

  if (!foundBug) {
    res.status(404).json({ error: 'Bug Not Found'});
  } else {
    if (classification != undefined) {
      foundBug.classification = classification;
      foundBug.classifiedOn = new Date();
      foundBug.lastUpdated = new Date();
    }
    await dbModule.updateOneBug(bugId, foundBug);
    res.status(200).json({message: `Bug ${bugId} updated!`});
  }

});

router.put('/:bugId/assign', validId('bugId'), validBody(assignSchema),  async (req, res, next) => {
  // Assign bug to user and send response as JSON;
  let bugId = req.bugId;
  const assignedToUserId = dbModule.newId(req.body.assignedToUserId);
  debugMain(assignedToUserId);

  const user = await dbModule.findUserById(assignedToUserId);
  debugMain(user);

  const foundBug = await dbModule.findBugById(bugId);
  const userName = user.firstName;

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else {
    if (user != undefined) {
      foundBug.assignedToUserId = dbModule.newId(assignedToUserId);
    } else {
      res.status(404).json({ error: `UserId ${assignedToUserId} Not Found`});
    }

    if (userName != undefined) {
      foundBug.assignedToUserName = userName;
    } else {
      res.status(404).json({ error: `Username ${userName} Not Found`});
    }

    foundBug.assignedOn = new Date();
    foundBug.lastUpdated = new Date();

    await dbModule.updateOneBug(bugId, foundBug);
    res.status(200).json({message: `Bug ${bugId} assigned to ${userName}!`});
}});

router.put('/:bugId/close', validId('bugId'), async (req, res, next) => {
  // Close bug and send response as JSON;
  const bugId = req.bugId;
  debugMain(bugId);
  const foundBug = await dbModule.findBugById(bugId);
  debugMain(foundBug);

  if (!foundBug) {
    res.status(404).json({ error: `Bug ${bugId} Not Found`});
  } else { 
    foundBug.closed = true;
    foundBug.closedOn = new Date();
    foundBug.lastUpdated = new Date();
  }

  debugMain("conditional complete");

  await dbModule.updateOneBug(bugId, foundBug);
  res.status(200).json({message:`Bug ${bugId} closed!`});
});
 
// Export Router
export {router as productRouter};