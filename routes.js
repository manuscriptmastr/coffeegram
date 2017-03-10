const Router = require('koa-router');
const { Coffeegram } = require('./database');
const pug = require('pug');

let router = Router();

var home = pug.compileFile('templates/home.pug');
var about = pug.compileFile('templates/about.pug');
var upload = pug.compileFile('templates/new.pug');

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
