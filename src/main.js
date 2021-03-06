const PRODUCTION = process.env.NODE_ENV === 'production';

if (!PRODUCTION) {
  require('dotenv').config();
}

var path = require('path');

var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var IP = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var UPLOAD_DIR = process.env.OPENSHIFT_DATA_DIR || path.resolve(__dirname, '../uploads');

const Koa = require('koa');
const passport = require('koa-passport');
const Strategy = require('passport-local').Strategy;
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const serve = require('koa-static');
const mount = require('koa-mount');
const bcrypt = require('bcryptjs');
const views = require('koa-views');
const moment = require('moment');
const crypto = require('crypto');
const router = require('./routes');
const auth = require('./auth');
const db = require('./database');
const enforceHttps = require('koa-sslify');
const { MONGODB_URI, User } = db;
const secret = process.env.SESSION_SECRET;
const formidable = require('formidable');
const bodyParser = require('koa-better-body');
const handleNotFound = require('./404-middleware');
const { NotFound } = require('./error');
const flash = require('./flash');

var app = new Koa();

if (PRODUCTION) {
  app.use(convert(enforceHttps({
    trustProtoHeader: true
  })))
}

app.keys = [secret];

var form = new formidable.IncomingForm({
  uploadDir: UPLOAD_DIR,
  keepExtensions: true
});

app.use(mount('/assets', serve(path.resolve(__dirname, '../assets'))));

app.use(mount('/uploads', serve(UPLOAD_DIR)));

app.use(convert(bodyParser({
  multipart: true,
  fields: 'body',
  IncomingForm: form
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

app.use(flash);

app.use(passport.initialize({ userProperty: 'currentUser' }));
app.use(passport.session());

app.use(views(path.resolve(__dirname, '../templates'), {
  extension: 'pug',
  options: {
    helpers: {
      gravatar: email => {
        var hash = crypto.createHash('md5').update(email).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}.jpg?s=300`;
      },
      momentFrom: date => {
        return moment(date).fromNow();
      }
    }
  }
}));

app.use(handleNotFound);

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

app.listen(PORT, IP);
