const CustomError = require('../../entities/customError');
/* eslint-disable no-console */
/* eslint-disable consistent-return */
function init(displayErrors) {
  return (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    let statusCode = 500;
    let message = displayErrors ? err.message : 'An unexpected error occurred.';
    if (err instanceof CustomError) {
      message = err.getErrorMessage();
      statusCode = err.getStatusCode();
    } else {
      console.error('[express] ', err);
    }
    res.status(statusCode);
    res.json({ message });
  };
}

module.exports = {
  init,
};