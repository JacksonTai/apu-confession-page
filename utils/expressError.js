/**
 * @ExpressError
 * Customize error class that allows error objects to have
 * desired error message and status code.
 */
class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
module.exports = ExpressError;
