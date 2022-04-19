const { response } = require("express");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const validarJWT = (req, resp = response, next) => {
  // x-token header
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token el la peticion",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.name = name;
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};

module.exports = { validarJWT };
