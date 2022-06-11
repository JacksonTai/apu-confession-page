const express = require("express");
const app = express();
const session = require('express-session')
const Confession = require('./models/confessions')
const { confessionSchema } = require("./joiSchema");

const validateReqBody = (reqBody) => {
    const { error } = confessionSchema.validate(reqBody);
    if (error) {
        const { confession: input } = reqBody

        // Derive info in this way: {field: error message}
        const err = error.details.map(el => ({ [el.context.key]: el.message }))
        const errMsg = Object.assign(...err)

        return { errMsg, input }
    }
}

module.exports.validateConfession = async (req, res, next) => {
    const error = validateReqBody(req.body)
    if (error) {
        const { errMsg, input } = error
        const data = { input, errMsg }

        if (req.method == "PUT") {
            req.session.editFormData = data
            return res.redirect(`/confessions/${req.params.id}/edit`);
        }
        if (req.method == "POST") {
            data.queueNum = await Confession.find().count();
            return res.render('confessions/create', data);
        }
    }
    next();
};
