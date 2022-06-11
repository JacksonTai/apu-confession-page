/**
 * @catchAsync
 * Catch the error thrown in async function that was passed
 * in as a param and hand in the error to the next() to reach
 * the next error handler (middleware).
 * @params {fn} async function
 * @return async function
 */
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((e) => next(e));
  };
};
