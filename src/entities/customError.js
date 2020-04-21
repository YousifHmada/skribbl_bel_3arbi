class CustomError extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.getErrorMessage = () => message;
    this.getStatusCode = () => statusCode;
  }
}

module.exports = CustomError;
