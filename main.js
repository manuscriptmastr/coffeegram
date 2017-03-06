var Koa = require('koa');
var router = require('./routes')

var app = new Koa();

app.use(router.routes());

app.listen(3000);
