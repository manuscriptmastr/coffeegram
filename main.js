var Koa = require('koa');
var app = new Koa();

var welcome = 'Hello World!';

app.use(ctx => {
  ctx.body = welcome;
});

app.listen(3000);
