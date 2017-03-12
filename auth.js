const Router = require('koa-router');
const { User } = require('./database');
const passport = require('koa-passport');
const pug = require('pug');

let auth = Router();

var signup = pug.compileFile('templates/signup.pug');
var login = pug.compileFile('templates/login.pug');

auth.get('/users/new', async ctx => {
  ctx.body = signup({});
});

auth.get('/sessions/new', async ctx => {
  ctx.body = login({});
});

auth.post('/sessions', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sessions/new'
}));

auth.post('/users', async ctx => {
  var { name, email, username, password } = ctx.request.body;

  var user = await User.create({
    name,
    email,
    username,
    password
  });
  ctx.login(user);
  ctx.redirect('/');
});

module.exports = auth;
