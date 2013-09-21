var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  parent_category: {
    type: Schema.ObjectId,
    ref: 'Category'
  }
});

mongoose.model('Category', CategorySchema);