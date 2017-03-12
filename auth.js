const Router = require('koa-router');
const { User } = require('./database');
const passport = require('koa-passport');
const pug = require('pug');

let auth = Router();

var authMsg = "You've been served by Auth";

var signup = pug.compileFile('templates/signup.pug');
var login = pug.compileFile('templates/login.pug');

auth.get('/users/new', async ctx => {
  ctx.body = signup({});
  console.log(authMsg);
});

auth.get('/sessions/new', async ctx => {
  ctx.body = login({});
  console.log(authMsg);
});

auth.post('/sessions', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/sessions/new'
}));

module.exports = auth;
