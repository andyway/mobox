var mongoose = require('mongoose'),
  async = require('async'),
  Currency = mongoose.model('Currency');

exports.all = function(req, res) {
  Currency.find().sort('name').exec(function(err, data) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(data);
    }
  });
};

/**
* @todo - remove this dummy func
* 
*/
exports.dummy = function(req, res, next) {
  new Currency({ name: 'Euro', code: 'eur'}).save(function(err) {
    if (err) return next(err);
  });
  
  new Currency({ name: 'US Dollar', code: 'usd'}).save(function(err) {
    if (err) return next(err);
  });
  
  return next();
};