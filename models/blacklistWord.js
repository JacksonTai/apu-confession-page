const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlacklistWordSchema = Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('BlacklistWord', BlacklistWordSchema);
