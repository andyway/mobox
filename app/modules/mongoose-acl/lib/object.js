var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = function(schema, options) {
    options = options || (options = {});
    options.path || (options.path = '_acl');

    // Fields

    var fields = {};

    if (!schema.paths[options.path]) {
      fields[options.path] = [{
        user: {
          type: Schema.ObjectId,
          ref: 'User'
        },
        username: {
          type: String,
          default: '',
          trim: true
        },
        access: {
          type: String,
          default: '',
          trim: true
        }
      }];
    }
    schema.add(fields);

    // Methods

    schema.methods.getAccess = function(user) {
      var length = this[options.path].length;

      if (!user) return null;
      if (user._id) user = user._id;
      user = user.toString();
      
      for (var i=0;i<length; i++) {
        if (!this[options.path][i]) continue;
        if (this[options.path][i].user.toString() == user) {
          return this[options.path][i].access;
        }
      }
      
      return null;
    };

    schema.methods.setAccess = function(key, perms) {
      if (!this.removeAccess(key)) return false;
      
      this[options.path].push({
        user: key._id,
        username: key.email,
        access: perms
      });
      this.markModified(options.path);
    };

    schema.methods.removeAccess = function(key) {
      var length = this[options.path].length;
      this[options.path] || (this[options.path] = {});
      if (!key || !key._id) return false;
      
      for (var i=0;i<length; i++) {
        if (!this[options.path][i]) continue;
        if (this[options.path][i].user.toString() == key._id.toString()) {
          this[options.path].splice(i, 1);
        }
      }

      this.markModified(options.path);
      return true;
    };

    schema.methods.keysWithAccess = function(perms) {
        perms || (perms = []);

        var acl = this[options.path] || {};
        var length = perms.length;
        var keys = [];

        for (var key in acl) {
            var count = 0;

            for (var i = 0; i < length; i++) {
                if (acl[key].indexOf(perms[i]) !== -1) {
                    count++;
                }
            }

            if (count === length) {
                keys.push(key);
            }
        }

        return keys;
    };

    var toJSON = schema.methods.toJSON;

    schema.methods.toJSON = function() {
        var data = toJSON ? toJSON.call(this) : this.toObject();
        delete data[options.path];
        return data;
    };

    schema.methods.toOwnerJSON = function() {
      var data = toJSON ? toJSON.call(this) : this.toObject();
      
      data.access = 'Owner';
      return data;
    };

    schema.methods.toUserJSON = function(user) {
      var data = toJSON ? toJSON.call(this) : this.toObject();
      delete data[options.path];
      
      data.access = this.getAccess(user);
      return data;
    };

    // Statics

    schema.statics.withAccess = function(subject, perms, callback) {
        var keys = subject.getAccessKeys();

        var or = keys.map(function(key) {
            var query = {};
            var path = [options.path, key].join('.');

            query[path] = { $all: perms };
            return query;
        });

        var cursor = this.find({ $or: or });

        if (callback) {
            cursor.exec(callback);
        }

        return cursor;
    };
};