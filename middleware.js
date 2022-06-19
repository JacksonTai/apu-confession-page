const xss = require('xss')
const Confession = require('./models/confessions');
const validateReqBody = require('./utils/validateReqBody');
const { confessionSchema, signinSchema } = require("./joiSchema");

module.exports.validateConfession = async (req, res, next) => {
    const error = validateReqBody(confessionSchema, req.body);
    if (error) {
        error.input = req.body.confession;
        switch (req.method) {
            case "PUT":
                req.session.editFormData = error;
                return res.redirect(`/confessions/${req.params.id}/edit`);
            case "POST":
                error.queueNum = await Confession.find().count();
                return res.render('confessions/create', error);
        }
    }
    next();
};

module.exports.validateSignin = async (req, res, next) => {
    const error = validateReqBody(signinSchema, req.body);
    if (error) {
        error.input = req.body.signin;
        return res.render('admin/signin', error);
    }
    next();
}

module.exports.authenticate = async (req, res, next) => {
    // Turn caching off.
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    req.session.admin_id ? next() : res.render('admin/signin');
}

module.exports.sanitizeHtml = async (req, res, next) => {
    let resource = Object.values(req.body)[0];

    Object.entries(resource).forEach((item) => {
        resource[item[0]] = xss(item[1])
    })
    next()
}