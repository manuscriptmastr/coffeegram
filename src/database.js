const MONGODB_URI = process.env.MONGODB_URI || process.env.OPENSHIFT_MONGODB_DB_URL;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isBlank } = require('underscore.string');

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: String
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);

var CoffeegramSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  image: { type: String, required: true },
  description: String,
  type: { type: String, required: true },
  shop: String
}, { timestamps: true });

var Coffeegram = mongoose.model('Coffeegram', CoffeegramSchema);

module.exports = {
  MONGODB_URI,
  Coffeegram,
  User
};
