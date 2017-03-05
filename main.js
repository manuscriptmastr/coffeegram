var Koa = require('koa');
var app = new Koa();
var pug = require('pug');

var homePage = pug.compileFile('templates/index.pug');

app.use(ctx => {
  ctx.body = homePage({
    url: ctx.url
  });
});

app.listen(3000);
