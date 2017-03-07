var Router = require('koa-router');
var router = Router();

var pug = require('pug');

var home = pug.compileFile('templates/index.pug');
var about = pug.compileFile('templates/about.pug');
var form = pug.compileFile('templates/new.pug');

router.get('/', async ctx => {
  ctx.body = home({});
});

router.get('/about', async ctx => {
  ctx.body = about({});
});

router.get('/new', async ctx => {
  ctx.body = form({});
});

module.exports = router;
