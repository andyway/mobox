var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

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
  balance: {
    type: Number,
    default: 0
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
  }
});

mongoose.model('Account', AccountSchema);