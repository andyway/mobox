var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  description: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  type: {
    type: Number,
    default: 1
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  incured_by: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  account: {
    type: Schema.ObjectId,
    ref: 'Account',
    required: true
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  category: {
    type: Schema.ObjectId,
    ref: 'Category'
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});

mongoose.model('Transaction', TransactionSchema);