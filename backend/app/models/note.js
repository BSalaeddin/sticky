const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  content: { type: String, required: false },
  position: { type: {x: Number, y: Number}, require: true},
  color: { type: String, require},
  visible: { type: Boolean, require}
});

module.exports = mongoose.model('Note', noteSchema);
