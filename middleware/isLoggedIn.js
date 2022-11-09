// 🔒 isLoggedIn() Middleware:

//    🔲 Requirements (💯) — Check if the user is currently logged in.

//       ✔️ 1. If req.auth is truthy, then just call the next middleware..
//       ✔️ 2. If req.auth is falsy, then send a 401 response..

const isLoggedIn = () => {
  return (req, res, next) => {

      if (req.auth) {
        return next(); 
      } else {
        return res.status(401).json({  error: `User is not logged in..` });     // ⛔️ SEND ERROR 401: UNAUTHORIZED (req: 2)
      }

  };
};

export {isLoggedIn};