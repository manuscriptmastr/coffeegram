const Router = require('koa-router');
const { User } = require('./database');
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

module.exports = auth;
