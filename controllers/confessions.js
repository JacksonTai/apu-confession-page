const Confession = require('../models/confessions');

module.exports.create = async (req, res) => {
    const queueNum = await Confession.find().count();
    res.render('confessions/create', { queueNum });
}

module.exports.store = async (req, res) => {
    const { _id } = await Confession.findOne().sort({ _id: 'desc' }).select('_id')
    let { confession } = req.body
    confession._id = _id + 1
    confession = await new Confession(confession).save();
    res.redirect(`/confessions/create?status=submitted&id=${encodeURIComponent(confession.apucpId)}`,);
}

module.exports.index = async (req, res) => {
    let result = req.query.result ? req.query.result : 10;

    const confessions = await Confession.find().sort({ _id: 'asc' }).limit(result);
    const count = await Confession.countDocuments({});

    const viewMore = result >= count ? false : true;
    res.render('confessions/index', { confessions, viewMore, count });
}

module.exports.show = async (req, res) => {
    const confession = await Confession.findById(req.params.id);
    res.render('confessions/show', { confession });
}

module.exports.api = async (req, res) => {
    let result = req.query.result ? req.query.result : 10;
    const limit = 10;
    const skip = result - limit;

    const confessions = await Confession.find()
        .sort({ _id: 'asc' })
        .skip(skip)
        .limit(limit);

    let confessionsTxt = '';
    for (let confession of confessions) {
        confessionsTxt += `<a class="confession__item" href="/confessions/${confession._id}" id="${confession._id}">
                                <p class="confession__id">${confession.apucpId}</p>
                                <div class="wrapper">
                                    <p class="confession__content">
                                        ${confession.content}
                                    </p>
                                    <span>${confession.status}</span>
                                </div>
                            </a>`
    }
    res.send(confessionsTxt)
}

module.exports.update = async (req, res) => {
    await Confession.findByIdAndUpdate(req.params.id, req.body.confession);
    res.redirect(`/confessions/${req.params.id}/edit?status=edited&confession=${req.params.id}`);
}

module.exports.edit = async (req, res) => {
    let input, errMsg;
    if (req.session.editFormData) {
        let { editFormData: data } = req.session;
        input = data.input;
        errMsg = data.errMsg;
        req.session.editFormData = null;
    }
    const confession = await Confession.findById(req.params.id);
    res.render('confessions/edit', { confession, input, errMsg });
}

module.exports.destroy = async (req, res) => {
    await Confession.findByIdAndDelete(req.params.id);
    res.redirect('/confessions');
}
