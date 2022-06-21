const Confession = require('../models/confessions');
const FB = require('fb')

module.exports.create = async (req, res) => {
    const queueNum = await Confession.find().countDocuments({});
    res.render('confessions/create', { queueNum });
};

module.exports.store = async (req, res) => {
    delete req.session.tempConfession;
    let { confession } = req.body;
    confession = await new Confession(confession).save();
    res.redirect(`/confessions/create?status=submitted&id=${encodeURIComponent(confession.apucpId)}`);
};

module.exports.index = async (req, res) => {
    let result = req.query.result ? req.query.result : 10;
    const confessions = await Confession.find().sort({ _id: 'asc' }).limit(result);
    const count = await Confession.countDocuments({});
    const viewMore = result >= count ? false : true;
    res.render('confessions', { confessions, viewMore, count });
};

module.exports.show = async (req, res) => {
    Confession.findById(req.params.id).exec((err, doc) => {
        let confession = doc.toObject();
        confession.apucpId = doc.apucpId;
        confession.timestamp = doc.timestamp;
        confession.content = confession.content.replaceAll("\n", "<br>");
        res.render('confessions/show', { confession });
    });
};

module.exports.api = async (req, res) => {
    if (req.query.id) {
        Confession.findById(req.query.id).exec((err, doc) => {
            let obj = doc.toObject();
            obj.apucpId = doc.apucpId;
            obj.timestamp = doc.timestamp;
            return res.send(obj);
        });
    }
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
    res.send(confessionsTxt);
};

module.exports.update = async (req, res) => {
    await Confession.findByIdAndUpdate(req.params.id, req.body.confession);
    res.redirect(`/confessions/${req.params.id}/edit?status=edited&confession=${req.params.id}`);
};

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
};

module.exports.destroy = async (req, res) => {
    await Confession.findByIdAndDelete(req.params.id);
    return req.params.approve ? null : res.redirect('/confessions');
};

module.exports.approve = async (req, res) => {
    const id = req.query.id || null
    if (id) {
        const { id } = req.query
        const confession = await Confession.findById(id)
        const { apucpId, content, timestamp, photo } = confession;
        const endpoint = photo ? "photos" : "feed";
        FB.api(
            `/${process.env.FB_PAGE_ID}/${endpoint}?`,
            'POST',
            {
                "url": photo || '',
                "message": `${apucpId}\n${content}\n\nConfession on: ${timestamp}`,
                "access_token": process.env.FB_ACCESS_TOKEN
            },
            async function (response) {
                if (!response.error) {
                    await Confession.findByIdAndDelete(id).exec((err, doc) => {
                        let confession = doc.toObject();
                        confession.apucpId = doc.apucpId;
                        res.json({ confession })
                    });
                    return
                }
                res.send(response.error);
            }
        );
    }
}

module.exports.tempConfession = async (req, res) => {
    req.session.tempConfession = req.body.confession;
    res.send(req.session.tempConfession)
}