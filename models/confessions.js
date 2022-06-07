const mongoose = require('mongoose');
const { Schema } = mongoose

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

const ConfessionSchema = new Schema({
    images: [ImageSchema],
    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Confession', ConfessionSchema);