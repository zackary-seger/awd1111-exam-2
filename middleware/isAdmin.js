// 🔒 isAdmin() Middleware:

//    🔲 Requirements (💯) — Checks if the user is logged in as an administrator.

//       ✔️ 1. If req.auth is falsy, then send a 401 response.
//       ✔️ 2. If the user is logged in but not an admin, then send a 403 response.
//       ✔️ 3. If the user is logged in as an admin, then just call the next middleware.


const isAdmin = () => {
  return (req, res, next) => {

      if (req.auth) {
        
        console.log('\n');
        console.log(req.auth);
        console.log('\n');

        if (!req.auth.admin || req.auth.admin == false) {
          return res.status(403).json({  error: `USER UNAUTHORIZED ➣ INSUFFICIENT PERMISSIONS` });     // ⛔️ SEND ERROR CODE 403: UNAUTHORIZED 
        } else {
          next();
        }
        
      } else {
        return res.status(401).json({  error: `User is not logged in..` });     // ⛔️ SEND ERROR CODE 401: UNAUTHORIZED
      }

  };
};

export {isAdmin};