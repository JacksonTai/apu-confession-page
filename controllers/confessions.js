const Confession = require('../models/confessions');

module.exports.create = async (req, res) => {
    res.render('confessions/create')
}

module.exports.store = async (req, res) => {
    const { confession } = req.body;
    let { content, media } = confession
    content = content.trim()
    media = media.trim()

    await new Confession(confession).save();
    res.redirect('/')
}

module.exports.index = async (req, res) => {
    const confessions = await Confession.find().sort({ _id: 'desc' });
    console.log(confessions);
    res.render('confessions/index', { confessions });
}

module.exports.show = async (req, res) => {
    const confession = await Confession.findById(req.params.id);
    res.render('confessions/show', { confession });
}

module.exports.update = async (req, res) => {
    res.send('confession edited')
}

module.exports.edit = async (req, res) => {
    res.render('confessions/edit')
}

module.exports.destroy = async (req, res) => {
    res.send('confession deleted')
}
