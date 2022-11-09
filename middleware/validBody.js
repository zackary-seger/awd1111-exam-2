// 🔑 validBody Middleware: 💯

//    ✔️ 1. Checks if the request body is valid using a Joi object schema.
//    ✔️ 2. If the body is valid, it replaces the body with the sanitized data and calls the next middleware.
//    ✔️ 3. If the body is invalid, it sends a 400 response.

const validBody = ( schema ) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body, { abortEarly: false });
    if (validateResult.error){
      return res.status(400).json({  error: `${validateResult.error}` });
    } else {
      req.body = validateResult.value;
      return next();
    }
  };
};

export {validBody};