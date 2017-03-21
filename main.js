const Koa = require('koa');
const passport = require('koa-passport');
const Strategy = require('passport-local').Strategy;
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const serve = require('koa-static');
const mount = require('koa-mount');
const bcrypt = require('bcrypt');
const views = require('koa-views');
const crypto = require('crypto');
const router = require('./routes');
const auth = require('./auth');
const db = require('./database');
const { MONGODB_URI, User } = db;
const secret = "3fhfivo'+_#@V',>"
const bodyParser = require('koa-better-body');
const { NotFound } = require('./error');

var app = new Koa();

app.keys = [secret];

app.use(mount('/uploads', serve('./uploads')));

app.use(convert(bodyParser({
  multipart: true,
  fields: 'body',
  uploadDir: './uploads',
  keepExtensions: true
})));

app.use(convert(
  session({
    store: new MongoStore({
      url: MONGODB_URI
    })
  })
));

passport.use(new Strategy({usernameField: 'email', passwordField: 'password'},
  async (email, password, cb) => {
    var user = await User.findOne({email});
    if (!user) {
      return cb(null, false);
    }
    if (await bcrypt.compare(password, user.password)) {
      return cb(null, user);
    }
    return cb(null, false);
  }
));

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  var user = await User.findById(id);
  cb(null, user);
});

app.use(async (ctx, next) => {
  if (!ctx.session.flash) {
    ctx.session.flash = {};
  }
  ctx.request.flash = (type, msg) => {
    ctx.session.flash[type] = msg;
  }
  ctx.flash = ctx.session.flash;
  ctx.session.flash = {};
  ctx.state.flash = ctx.flash;

  await next();

  if (ctx.status === 302 && ctx.session && !(ctx.session.flash)) {
    ctx.session.flash = ctx.flash;
  }
});

app.use(passport.initialize({ userProperty: 'currentUser' }));
app.use(passport.session());

app.use(views(__dirname + '/templates', {
  extension: 'pug',
  options: {
    helpers: {
      gravatar: email => {
        var hash = crypto.createHash('md5').update(email).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}.jpg?s=300`;
      }
    }
  }
}));

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e instanceof NotFound) {
      ctx.status = 404;
      await ctx.render('404', {});
    } else {
      throw e;
    }
  }
});

app.use(auth.routes());

app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    await next();
  } else {
    ctx.redirect('/sessions/new');
  }
});

app.use(router.routes());

app.use(async (ctx) => {
  throw new NotFound();
});

app.listen(3000);
