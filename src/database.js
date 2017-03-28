const MONGODB_URI = process.env.MONGODB_URI || process.env.OPENSHIFT_MONGODB_DB_URL;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String
});

var User = mongoose.model('User', UserSchema);

var CoffeegramSchema = new Schema({
  userId: Schema.Types.ObjectId,
  image: String,
  description: String,
  coffeeType: String,
  timestamp: Number
});

var Coffeegram = mongoose.model('Coffeegram', CoffeegramSchema);

module.exports = {
  MONGODB_URI,
  Coffeegram,
  User
};
