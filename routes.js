var Router = require('koa-router');
var router = Router();

var pug = require('pug');

var homePage = pug.compileFile('templates/index.pug');
var aboutPage = pug.compileFile('templates/about.pug');

router.get('/', async ctx => {
  ctx.body = homePage({});
});

router.get('/about', async ctx => {
  ctx.body = aboutPage({});
});

module.exports = router;
