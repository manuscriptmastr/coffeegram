const Router = require('koa-router');
const { User } = require('./database');
const passport = require('koa-passport');
const bcrypt = require('bcrypt');
const pug = require('pug');

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
    'password': passwordFirst,
    'password-confirmation': passwordConfirmation
  } = ctx.request.body;
  if (passwordFirst!==passwordConfirmation) {
    await ctx.render('signup', { error: "Make sure your passwords match" });
  } else {
    var hash = await bcrypt.hash(passwordFirst, saltRounds);
    var success = false;
    try {
      var user = await User.create({
        name,
        email,
        username,
        password: hash
      });
      success = true;
    } catch (error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        await ctx.render('signup', { error: "Your username or email has already been used" });
      } else {
        throw error;
      }
    }
    if (success) {
      ctx.login(user);
      ctx.request.flash('loggedin', "Welcome to Coffeegrams, " + user.name);
      ctx.redirect('/');
    }
  }
});

module.exports = auth;
