const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConfessionSchema = new Schema({
    time: {
        type: Date,
        default: Date.now
    },
    media: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Blacklisted'],
        default: 'Pending',
        required: true
    },
});

ConfessionSchema.virtual('timestamp').get(function () {
    let timestamp = this.time.toISOString().replace('T', '-').split('-');
    let time = this.time.toString().split(' ')[4];
    return `${timestamp[2]}-${timestamp[1]}-${timestamp[0]} ${time}`;
})

module.exports = mongoose.model('Confession', ConfessionSchema);