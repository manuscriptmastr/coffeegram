var Router = require('koa-router');
var router = Router();
var DB = require('./database');
var db = DB();

var pug = require('pug');

var home = pug.compileFile('templates/home.pug');
var about = pug.compileFile('templates/about.pug');
var upload = pug.compileFile('templates/new.pug');

router.get('/', async ctx => {
  ctx.body = home({
    data: db
  });
});

router.get('/about', async ctx => {
  ctx.body = about({});
});

router.get('/new', async ctx => {
  ctx.body = upload({});
});

router.post('/submit', async ctx => {
  db.push(ctx.request.body);
  ctx.redirect('/');
});

module.exports = router;
