var MONGODB_URI = 'mongodb://localhost/coffeegram_dev';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  password: String
});

var User = mongoose.model('User', UserSchema);

var CoffeegramSchema = new Schema({
  description: String,
  coffeeType: String
});

var Coffeegram = mongoose.model('Coffeegram', CoffeegramSchema);

module.exports = {
  MONGODB_URI,
  Coffeegram,
  User
};
