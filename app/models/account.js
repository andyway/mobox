var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema,
  acl = require('../modules/mongoose-acl');

var AccountSchema = new Schema({
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
  currency: {
    type: Schema.ObjectId,
    ref: 'Currency',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  statistics: [{
    project: {
      type: Schema.ObjectId,
      ref: 'Project',
      required: true
    },
    sum: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }]
    
});

AccountSchema.methods.getProjectStatistics = function (project) {
  var i = 0, len;
  
  len = this.statistics.length;
  for (;i<len;i++) {
    if (this.statistics[i].project.toString() == project.toString()) {
      return { index: i, data: this.statistics[i] };
    }
  }
  
  return { index: -1, data: { project: project, count: 0, sum: 0 } };
};

AccountSchema.methods.updateProjectStatistics = function (project, sum, count) {
  var statistics = this.getProjectStatistics(project);
  
  statistics.data.count += count;
  statistics.data.sum += sum;
  
  this.balance += sum;

  if (statistics.index > -1) {
    this.statistics[statistics.index] = statistics.data;
  }
  else {
    this.statistics.push(statistics.data);
  }

  this.save();
  
  return (statistics.index == -1);
};

AccountSchema.plugin(acl.object);
mongoose.model('Account', AccountSchema);

