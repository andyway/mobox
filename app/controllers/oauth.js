var mongoose = require('mongoose'),
    UserModel = mongoose.model('User'),
    ClientModel = mongoose.model('Client'),
    AccessTokenModel = mongoose.model('AccessToken'),
    RefreshTokenModel = mongoose.model('RefreshToken'),
    faker = require('Faker');

exports.createClient = function(req, res, next) {
  UserModel.remove({}, function(err) {
      var usr = new UserModel({ username: "user", password: "user", email: "user" });
      usr.save(function(err, user) {
          if(err) return console.log(err);
          else console.log("New user - %s:%s",user.username,user.password);
      });

  });

  ClientModel.remove({}, function(err) {
      var client = new ClientModel({ name: "test client", clientId: "client", clientSecret:"client" });
      client.save(function(err, client) {
          if(err) return console.log(err);
          else console.log("New client - %s:%s",client.clientId,client.clientSecret);
      });
  });
  AccessTokenModel.remove({}, function (err) {
      if (err) return console.log(err);
  });
  RefreshTokenModel.remove({}, function (err) {
      if (err) return console.log(err);
  });
  
  next();
};
