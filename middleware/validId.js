import { ObjectId } from 'mongodb';
 
const validId = (paramName) => {
  return (req, res, next) => {
    try {
      req[paramName] = new ObjectId(req.params[paramName]);
      return next();
    } catch {
      return res.status(404).json({  error: `${paramName} was not a valid ObjectId.` });
    }
  };
};

export {validId};