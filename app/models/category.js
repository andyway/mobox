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
  color: {
    type: String,
    default: '',
    trim: true
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  statistics: {
    sum: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  weight: {
    type: Number,
    default: 0
  }
});

CategorySchema.statics.updateStatistics = function (category, sum, count) {
  this.findByIdAndUpdate(category, { $inc: { 'statistics.count': count, 'statistics.sum': sum } }).exec();
}

mongoose.model('Category', CategorySchema);