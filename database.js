var MONGODB_URI = 'mongodb://localhost/coffeegram_dev';
var mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var CoffeegramSchema = new Schema({
  description: String,
  coffeeType: String
});

var Coffeegram = mongoose.model('Coffeegram', CoffeegramSchema);

module.exports = {
  Coffeegram
};
