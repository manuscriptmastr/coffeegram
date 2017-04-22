const MONGODB_URI = process.env.MONGODB_URI || process.env.OPENSHIFT_MONGODB_DB_URL;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isBlank } = require('underscore.string');
const { isEmail } = require('validator');

let isPresent = v => !isBlank(v);

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    validate: [{
      validator: isPresent,
      message: "Add your name"
    }]
  },
  email: {
    type: String,
    validate: [{
      validator: isPresent,
      message: "Email can't be blank"
    }, {
      validator: isEmail,
      message: "That's not a valid email"
    }],
    unique: true
  },
  username: {
    type: String,
    validate: [{
      validator: isPresent,
      message: "Username can't be blank"
    }, {
      validator: v => /^\w+$/.test(v),
      message: "Username can contain only letters, numbers and underscores"
    }],
    unique: true
  },
  password: {
    type: String,
    validate: [{
      validator: isPresent,
      message: "Password can't be blank"
    }]
  },
  bio: String
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);

var CoffeegramSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  image: { type: String, required: true },
  description: String,
  type: {
    type: String,
    validate: [{
      validator: isPresent,
      message: "Coffee type is required"
    }]
  },
  shop: String
}, { timestamps: true });

var Coffeegram = mongoose.model('Coffeegram', CoffeegramSchema);

module.exports = {
  MONGODB_URI,
  Coffeegram,
  User
};
