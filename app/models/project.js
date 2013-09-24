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
  }
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});


ProjectSchema.plugin(acl.object);
mongoose.model('Project', ProjectSchema);