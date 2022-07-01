const Confession = require('../models/confessions');
const BlacklistWord = require('../models/blacklistWord')
const FB = require('fb')

module.exports.create = async (req, res) => {
    const queueNum = await Confession.find().countDocuments({});
    res.render('confessions/create', { queueNum });
};

module.exports.store = async (req, res) => {
    // Remove confession stored in session.
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
    Confession.findById(req.params.id).exec(async (err, doc) => {
        let confession = doc.toObject();
        let { content } = confession
        confession.apucpId = doc.apucpId;
        confession.timestamp = doc.timestamp;
        confession.content = content.replaceAll('\n', '<br>');

        // Check for blacklist word and highlight it.
        let docs = await BlacklistWord.find().sort({ _id: 'desc' })
        const blacklistWords = docs.map(doc => (doc.content))

        let words = [];
        for (let blacklistWord of blacklistWords) {
            if (content.toLowerCase().includes(blacklistWord)) {
                let regex = new RegExp(blacklistWord, 'gi')
                words.push(...content.match(regex))
            }
        }
        if (words.length > 0) {
            for (let word of words) {
                confession.content = confession.content.replace(word, `<mark>${word}</mark>`)
            }
        }
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
                                    <p>${confession.status}</p>
                                </div>
                            </a>`
    }
    res.send(confessionsTxt);
};

module.exports.update = async (req, res) => {
    const { id } = req.params
    const { confession } = req.body

    // Make an array for submitted photo and video.
    let { photo = null, video = null } = confession
    confession.photo = (photo && photo.length > 0) ? photo.toString().split(',') : [];
    confession.video = (video && video.length > 0) ? video.toString().split(',') : [];

    Confession.findByIdAndUpdate(id, confession, (error, result) => {
        if (error) {
            console.log(error);
        }
    });
    res.redirect(`/confessions/${id}/edit?status=edited&confession=${id}`);
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

        // API for uploading confession that consists of multiple photos.
        if (photo.length > 1) {
            let photos = photo;
            FB.api(
                `/${process.env.FB_PAGE_ID}/albums?access_token=${process.env.FB_ACCESS_TOKEN}`,
                (response) => {
                    if (response && !response.error) {

                        // Look for the album's ID of confession by confession ID.
                        let albumId = null;
                        for (let album of response.data) {
                            if (album.name == apucpId) {
                                albumId = album.id
                            }
                        }

                        if (!albumId) {
                            response.error = {
                                message: `Album <strong>${apucpId}</strong> not found.</br></br>
                                <p>This confession consists of multiple photos. Kindly
                                <a href="https://business.facebook.com/latest/posts/photos?asset_id=${process.env.FB_PAGE_ID}" target="_blank">
                                    create an album</a> to post the confession.</p>`
                            }
                            return res.json(response.error)
                        }

                        // Upload photo to albums
                        req.session.counter = 0;
                        for (let photo of photos) {
                            FB.api(
                                `/${albumId}/photos`, "POST",
                                {
                                    "access_token": process.env.FB_ACCESS_TOKEN,
                                    "name": `${apucpId}\n${content}\n\nConfession on: ${timestamp}`,
                                    "url": photo,
                                },
                                function (response) {
                                    // Counter for posted photo.
                                    req.session.counter += 1

                                    // Check if all photos has been uploaded.
                                    if ((req.session.counter) == photos.length) {

                                        delete req.session.albumPhotos;
                                        if (response && !response.error) {
                                            Confession.findByIdAndDelete(id).exec((err, doc) => {
                                                let confession = doc.toObject();
                                                confession.apucpId = doc.apucpId;
                                                res.json({ success: true })
                                            });
                                            return
                                        }
                                        res.json(response.error)
                                    }
                                }
                            )
                        }
                    } else {
                        res.json(response.error)
                    }
                }
            );
        } else {
            // Endpoint for confession that have photo or not.
            const endpoint = (photo.length === 1) ? "photos" : "feed";

            const [link] = photo

            FB.api(
                `/${process.env.FB_PAGE_ID}/${endpoint}?`,
                'POST',
                {
                    "access_token": process.env.FB_ACCESS_TOKEN,
                    "url": link || '',
                    "message": `${apucpId}\n${content}\n\nConfession on: ${timestamp}`,
                },
                async (response) => {
                    if (response && !response.error) {
                        Confession.findByIdAndDelete(id).exec((err, doc) => {
                            let confession = doc.toObject();
                            confession.apucpId = doc.apucpId;
                            res.json({ success: true })
                        });
                        return
                    }
                    res.json(response.error);
                }
            );
        }
    }
}

module.exports.tempConfession = async (req, res) => {
    req.session.tempConfession = req.body.confession;
    res.send(req.session.tempConfession)
}