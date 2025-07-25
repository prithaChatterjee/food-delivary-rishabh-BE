module.exports = function(err, req, res, next) {
  console.error(err); // optional logging
  res.status(500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
