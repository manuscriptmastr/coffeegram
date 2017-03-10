const Router = require('koa-router');
const { Coffeegram } = require('./database');
const pug = require('pug');

let router = Router();

var signup = pug.compileFile('templates/signup.pug');
var login = pug.compileFile('templates/login.pug');
var home = pug.compileFile('templates/home.pug');
var upload = pug.compileFile('templates/new.pug');
var about = pug.compileFile('templates/about.pug');

router.get('/signup', async ctx => {
  ctx.body = signup({});
});

router.get('/login', async ctx => {
  ctx.body = login({});
});

router.get('/', async ctx => {
  var coffeegrams = await Coffeegram.find();
  ctx.body = home({
    coffeegrams
  });
});

router.get('/about', async ctx => {
  ctx.body = about({});
});

router.get('/new', async ctx => {
  ctx.body = upload({});
});

router.post('/submit', async ctx => {
  var form = ctx.request.body;

  Coffeegram.create({
    description: form['description'],
    coffeeType: form['coffee-type']
  });

  ctx.redirect('/');
});

module.exports = router;
