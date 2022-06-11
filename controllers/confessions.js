const Confession = require('../models/confessions');

module.exports.create = async (req, res) => {
    const queueNum = await Confession.find().count()
    res.render('confessions/create', { queueNum })
}

module.exports.store = async (req, res) => {
    await new Confession(req.body.confession).save();
    res.redirect('/confessions/create?status=submitted',);
}

module.exports.index = async (req, res) => {
    const confessions = await Confession.find().sort({ _id: 'desc' });
    res.render('confessions/index', { confessions });
}

module.exports.show = async (req, res) => {
    const confession = await Confession.findById(req.params.id);
    res.render('confessions/show', { confession });
}

module.exports.update = async (req, res) => {
    await Confession.findByIdAndUpdate(req.params.id, req.body.confession)
    res.redirect(`/confessions/${req.params.id}/edit?status=edited&confession=${req.params.id}`);
}

module.exports.edit = async (req, res) => {
    let input, errMsg;
    if (req.session.editFormData) {
        let { editFormData: data } = req.session
        input = data.input;
        errMsg = data.errMsg;
        req.session.editFormData = null
    }
    const confession = await Confession.findById(req.params.id)
    res.render('confessions/edit', { confession, input, errMsg })
}

module.exports.destroy = async (req, res) => {
    await Confession.findByIdAndDelete(req.params.id);
    res.redirect('/confessions')
}
