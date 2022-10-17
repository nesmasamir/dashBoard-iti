function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    //jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }
  if (err.name === "ValidationError") {
    //jwt validatione rror
    return res.status(401).json({ message: err });
  }
  //default to 500 server error
  return res.status(500).json({ message: "wrong" });
}
module.exports = errorHandler;
