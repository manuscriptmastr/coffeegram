const Router = require('koa-router');
const { User, Coffeegram } = require('./database');
const { NotFound } = require('./error');

let router = Router();

router.get('/', async ctx => {
  var coffeegrams = await Coffeegram.find();
  await ctx.render('home', {
    coffeegrams
  });
});

router.get('/users/:username', async ctx => {
  var user = await User.findOne({ username: ctx.params.username });
  if (!user) {
    throw new NotFound();
  }
  var coffeegrams = await Coffeegram.find({ userId: user.id });
  await ctx.render('usergrams', {
    user,
    coffeegrams
  });
});

router.get('/about', async ctx => {
  await ctx.render('about', {

  });
});

router.get('/coffeegrams/new', async ctx => {
  await ctx.render('new', {

  });
});

router.post('/coffeegrams', async ctx => {
  var form = ctx.request.body;
  await Coffeegram.create({
    userId: ctx.state.currentUser.id,
    image: form.image[0].path,
    description: form['description'],
    coffeeType: form['coffee-type']
  });

  ctx.redirect('/');
});

module.exports = router;
