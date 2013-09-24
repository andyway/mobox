var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    _ = require('underscore'),
    authTypes = ['github', 'twitter', 'facebook', 'google'],
    acl = require('../modules/mongoose-acl');


var UserSchema = new Schema({
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: String,
    provider: String,
    hashed_password: String,
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {}
});

UserSchema.virtual('userId')
  .get(function () {
      return this.id;
  });

    
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

UserSchema.path('name').validate(function(name) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email && email.length;
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  
  if (!this.password && this.password.length > 0 && authTypes.indexOf(this.provider) === -1) {
    return next(new Error('Invalid password'));
  }

  next();             
});


UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  encryptPassword: function(password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  }
};

var toJSON = UserSchema.methods.toJSON;

UserSchema.methods.toJSON = function() {
  var data = toJSON ? toJSON.call(this) : this.toObject();
  delete data.hashed_password;
  return data;
};


UserSchema.plugin(acl.subject, {
  key: function() {
    return 'user:' + this._id + ':' + this.name;
  }
});
mongoose.model('User', UserSchema);


// Client
var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

mongoose.model('Client', Client);

// AccessToken
var AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('AccessToken', AccessToken);

// RefreshToken
var RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('RefreshToken', RefreshToken);