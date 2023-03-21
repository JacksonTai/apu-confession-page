/**
 * @validateReqBody
 * Validate the request body and return relevant error messages.
 * @params {schema}, {reqBody}
 * @return errMsg(obj)
 */
module.exports = (schema, reqBody) => {
  const { error } = schema.validate(reqBody);
  if (error) {
    // Derive error message in this way: {field: error message}
    const err = error.details.map((el) => ({ [el.context.key]: el.message }));
    const errMsg = Object.assign(...err);
    return { errMsg };
  }
};
