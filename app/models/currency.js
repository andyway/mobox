var mongoose = require('mongoose'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

var CurrencySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: true
  },
  code: {
    type: String,
    default: '',
    trim: true,
    unique: true,
    required: true
  }
});

mongoose.model('Currency', CurrencySchema);