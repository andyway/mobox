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

CategorySchema.statics.updateStatistics = function (categories, sum, count) {
  this.update({ _id: { $in: categories } }, { $inc: { 'statistics.count': count, 'statistics.sum': sum } }, { multi: true }).exec();
}

mongoose.model('Category', CategorySchema);