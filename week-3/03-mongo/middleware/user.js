const { User } = require("../db");

async function userMiddleware(req, res, next) {
  try {
    const { username, password } = req.headers;
    const findUser = await User.findOne({
      username: username,
      password: password,
    });
    if (!findUser) return res.status(401).send();
    next();
  } catch (e) {
    res.status(512).send(e);
  }
}

module.exports = userMiddleware;
