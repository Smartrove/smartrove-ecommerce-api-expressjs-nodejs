const jwt = require("jsonwebtoken");

//jwt middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json({ msg: "token is not valid!" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ msg: "you are not authorized" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ msg: "you are not authorized" });
    }
  });
};
const verifyTokenByAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ msg: "you are not authorized" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenByAdmin,
};
