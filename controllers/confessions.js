module.exports.create = async (req, res) => {
    res.render('confessions/create')
}

module.exports.store = async (req, res) => {
    res.send('confession created')
}

module.exports.index = async (req, res) => {
    res.render('confessions/index')
}

module.exports.show = async (req, res) => {
    res.render('confessions/show')
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
