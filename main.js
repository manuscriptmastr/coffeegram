const Koa = require('koa');
const passport = require('koa-passport');
const Strategy = require('passport-local').Strategy;
const convert = require('koa-convert');
const session = require('koa-generic-session');
const MongoStore = require('koa-generic-session-mongo');
const router = require('./routes');
const auth = require('./auth');
const db = require('./database');
const { MONGODB_URI, User } = db;
const secret = "3fhfivo'+_#@V',>"
const bodyParser = require('koa-bodyparser');

var app = new Koa();

app.keys = [secret];

app.use(bodyParser());

app.use(convert(
  session({
    store: new MongoStore({
      url: MONGODB_URI
    })
  })
));

passport.use(new Strategy({usernameField: 'email'},
  async (email, password, cb) => {
    var user = await User.findOne({email});
    if (!user) {
      return cb(null, false);
    }
    if (user.password !== password) {
      return cb(null, false);
    }
    return cb(null, user);
  }
));

passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  var user = await User.findById(id);
  cb(null, user);
})

app.use(passport.initialize());
app.use(passport.session());

app.use(auth.routes());

app.use(async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    console.log("Successfully logged in");
    await next();
  } else {
    ctx.redirect('/sessions/new');
  }
});

app.use(router.routes());

app.listen(3000);
