import config from 'config';
import jwt from 'jsonwebtoken';

const auth = () => {
  return (req, res, next) => {

      const secret = config.get('auth.secret');
      const token = req.cookies.authToken;

      if (token) {

        const payload = jwt.verify(token, secret);
        req.auth = payload;
        return next();

      } else {
        return next();
      }

  };
};

export {auth};