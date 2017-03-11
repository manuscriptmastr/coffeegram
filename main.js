const Koa = require('koa');
const router = require('./routes')
const auth = require('./auth')
const bodyParser = require('koa-bodyparser');

var app = new Koa();

app.use(bodyParser());
app.use(auth.routes())
app.use(router.routes());

app.listen(3000);
