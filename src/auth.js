const Router = require('koa-router');
const { User } = require('./database');
const passport = require('koa-passport');
const bcrypt = require('bcryptjs');
const pug = require('pug');
const { trim, clean } = require('underscore.string');
const { validatePassword } = require('./validation');

let auth = Router();

const saltRounds = 10;

auth.get('/users/new', async ctx => {
  await ctx.render('signup', {});
});

auth.get('/sessions/new', async ctx => {
  await ctx.render('login', {});
});

auth.post('/sessions', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sessions/new'
}));

auth.post('/users', async ctx => {
  var {
    name,
    email,
    username,
    passwordFirst,
    passwordConfirmation
  } = ctx.request.body;

  name = clean(name);
  email = trim(email);
  username = trim(username);

  var userParams = {
    name,
    email,
    username,
    passwordFirst,
    passwordConfirmation
  }

  var errors = validatePassword(userParams);

  if (Object.keys(errors).length) {
    return await ctx.render('signup', ({ errors, userParams }));
  }

  var hash = await bcrypt.hash(passwordFirst, saltRounds);
  try {
    var user = await User.create({
      name,
      email,
      username,
      password: hash
    });
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return await ctx.render('signup', { error: "Your username or email has already been used", userParams });
    } else if (error.name === 'ValidationError') {
      return await ctx.render('signup', { errors: error.errors, userParams });
    } else {
      throw error;
    }
  }

  ctx.login(user);
  ctx.request.flash('success', "Welcome to Coffeegrams, " + user.name);
  ctx.redirect('/');
});

module.exports = auth;
