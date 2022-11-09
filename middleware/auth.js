const auth = () => {
  return (req, res, next) => {

      if (req.cookies.authToken) {
        req[auth] = req.cookies.authToken;
        return next();
      } else {
        return next();
      }

  };
};

export {auth};