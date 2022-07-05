const Joi = require('joi');

const opt = {
  stripUnknown: true,
  abortEarly: false,
};

module.exports.confessionSchema = Joi.object({
  confession: Joi.object({
    content: Joi.string()
      .trim()
      .required()
      .messages({ 'string.empty': 'Enter confession content' }),
    treaty: Joi.string().required().messages({
      'any.required': 'Treaty must be agreed to submit confession',
    }),
  }).required(),
}).options(opt);

module.exports.signinSchema = Joi.object({
  signin: Joi.object({
    username: Joi.string()
      .trim()
      .required()
      .messages({ 'string.empty': 'Enter your username.' }),
    password: Joi.string()
      .trim()
      .required()
      .messages({ 'string.empty': 'Enter your password.' }),
  })
    .required()
    .messages({ 'string.empty': 'Enter your password.' }),
}).options(opt);

module.exports.blacklistWordSchema = Joi.object({
  blacklistWord: Joi.object({
    content: Joi.string()
      .trim()
      .required()
      .messages({ 'string.empty': 'Enter blacklist word' }),
  }).required(),
}).options(opt);
