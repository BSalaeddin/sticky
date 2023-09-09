const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title: {type: String, require: true },
  notes:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  createdAt: {type: Date, require: true },
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

module.exports = mongoose.model('Project', projectSchema);
