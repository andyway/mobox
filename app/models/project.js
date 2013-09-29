var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema,
  acl = require('../modules/mongoose-acl');

var ProjectSchema = new Schema({
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
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  statistics: {
    sum: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    categories: {
      type: Number,
      default: 0
    },
    accounts: {
      type: Number,
      default: 0
    }
  }
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


ProjectSchema.methods.updateStatistics = function (sum, count, addAccount) {
  this.statistics.count += count;
  this.statistics.sum += sum;
  if (addAccount) {
    this.statistics.accounts++;
  }
  this.save();
  
};

ProjectSchema.plugin(acl.object);
mongoose.model('Project', ProjectSchema);