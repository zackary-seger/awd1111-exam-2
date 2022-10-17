
const validBody = ( schema ) => {
  return (req, res, next) => {
    const validateResult = schema.validate(req.body, { abortEarly: false });
    if (validateResult.error){
      return res.status(404).json({  error: `${validateResult.error}` });
    } else {
      req.body = validateResult.value;
      return next();
    }
  };
};

export {validBody};