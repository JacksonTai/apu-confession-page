const BlacklistWord = require('../models/blacklistWord')

module.exports.store = async (req, res) => {
    let { blacklistWord } = req.body;
    blacklistWord = await new BlacklistWord(blacklistWord).save();
    res.redirect('/blacklistWord')
};

module.exports.index = async (req, res) => {
    const blacklistWords = await BlacklistWord.find().sort({ _id: 'desc' })
    res.render('blacklistWord', { blacklistWords });
}

module.exports.api = async (req, res) => {
    const blacklistWords = await BlacklistWord.find().sort({ _id: 'desc' })
    res.json(blacklistWords)
}

module.exports.destroy = async (req, res) => {
    await BlacklistWord.findByIdAndDelete(req.params.id);
    res.redirect('/blacklistWord');
};