const Joi = require('joi');

module.exports.confessionSchema = Joi.object({
    confession: Joi.object({
        content: Joi.string()
            .trim()
            .required()
            .messages({ "string.empty": "Enter confession content" }),
        treaty: Joi.string()
            .required()
            .messages({ "any.required": "Treaty must be agreed to submit confession" }),
    }).required()
}).options({
    stripUnknown: true,
    abortEarly: false
});