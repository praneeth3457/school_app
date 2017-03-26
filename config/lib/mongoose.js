var mongoose = require('mongoose');
var creds = require('../database/default');

module.exports.connect = function(callback) {
  var db = mongoose.connect('mongodb://' + creds.host + '/' + creds.name, function(err){
      if(err) {
          return callback(err, 500);
      }

      return callback(false, 200);
  });
};