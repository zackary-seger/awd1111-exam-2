// 🔑 validId Middleware: 💯

// ✔️ 1. Checks if a route parameter exists and is a valid ObjectId.
// ✔️ 2. If it is a valid ObjectId, then it adds the parsed ObjectId to the request and calls the next middleware.
// ✔️ 3. If the route parameter is missing or invalid, it sends a 404 response.


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