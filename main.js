var Koa = require('koa');
var router = require('./routes')
var bodyParser = require('koa-bodyparser');

var app = new Koa();

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
