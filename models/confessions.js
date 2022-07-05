/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CounterSchema = Schema({
  _id: {
    type: Number,
    required: true,
    default: 1,
  },
  seq: {
    type: Number,
    default: 1,
  },
});
const Counter = mongoose.model('counter', CounterSchema);

const ConfessionSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
      default: 1,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    photo: {
      type: [String],
    },
    video: {
      type: [String],
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Blacklisted'],
      default: 'Pending',
      required: true,
    },
  },
  { _id: false },
);

// Virtual
ConfessionSchema.virtual('timestamp').get(function () {
  let timestamp = this.time.toISOString().replace('T', '-').split('-');
  let time = this.time.toString().split(' ')[4];
  return `${timestamp[2]}-${timestamp[1]}-${timestamp[0]} ${time}`;
});

ConfessionSchema.virtual('apucpId').get(function () {
  const zeroDigit = 5 - this._id.toString().length;
  let zero = '0';
  return `#APUCP${zero.repeat(zeroDigit) + this._id}`;
});

// Middleware
ConfessionSchema.pre('save', async function () {
  // Make an array for submitted photo and video.
  let { photo = null, video = null } = this;
  this.photo = photo.length > 0 ? photo.toString().split(',') : [];
  this.video = video.length > 0 ? video.toString().split(',') : [];

  // Counter for confession ID.
  let counter = await Counter.countDocuments();
  if (counter === 1) {
    let count = await Counter.findById(1);
    this._id = count.seq + 1;
    await Counter.findByIdAndUpdate(1, { $inc: { seq: 1 } });
  } else {
    await new Counter({ id: 1, seq: 1 }).save();
  }
});

module.exports = mongoose.model('Confession', ConfessionSchema);
