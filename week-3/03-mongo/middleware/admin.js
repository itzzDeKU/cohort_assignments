const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  try {
    const { username, password } = req.headers;
    const findAdmin = await Admin.findOne({
      username: username,
      password: password,
    });
    if (!findAdmin) return res.status(401).send();
    next();
  } catch (e) {
    res.status(512).send(e);
  }
}

module.exports = adminMiddleware;
