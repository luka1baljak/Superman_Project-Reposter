const jwt = require("jsonwebtoken");
const config = require("config");

//Midleware function, next-callback koja kaze sta je iduce(iduci middleware)
module.exports = function(req, res, next) {
  //Uzeti token iz headera
  const token = req.header("x-auth-token");

  //Provjeriti da token postoji
  if (!token) {
    return res.status(401).json({ msg: "Token ne postoji, niste authorizirani!" });
  }
  //Verify token ako postoji
  try {
    //dekodirati token
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token ne postoji, niste authorizirani!" });
  }
};
