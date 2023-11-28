const ApiError = require('../error/apiError');

module.exports = function (err, req, res, next) {
  console.error('Error occurred:', err);
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected error' });
};
