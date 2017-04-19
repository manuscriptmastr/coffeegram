const Router = require('koa-router');
const { User, Coffeegram } = require('./database');
const { NotFound } = require('./error');
const path = require('path');
const { clean, isBlank } = require('underscore.string');
const { pick, mapValues } = require('lodash');

let router = Router();

let hasOwnProperty = (obj, key) => Object.hasOwnProperty.call(obj, key);

router.get('/', async ctx => {
  var coffeegrams = await Coffeegram.find({}).sort({ createdAt: 'desc' });
  await ctx.render('home', {
    coffeegrams
  });
});

router.get('/users/:username', async ctx => {
  var user = await User.findOne({ username: ctx.params.username });
  if (!user) {
    throw new NotFound();
  }
  var coffeegrams = await Coffeegram.find({ userId: user.id }).sort({ createdAt: 'desc' });
  await ctx.render('usergrams', {
    user,
    coffeegrams
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
    image: path.basename(form.image[0].path),
    description: form['description'],
    type: form['type'],
    shop: form['shop']
  });

  ctx.request.flash('success', "Your new Coffeegram is up");

  ctx.redirect(`/users/${ctx.state.currentUser.username}`);
});

router.get('/coffeegrams/:id', async ctx => {
  var coffeegram = await Coffeegram.findById(ctx.params.id);
  if (!coffeegram) {
    throw new NotFound();
  }
  await ctx.render('gram', {
    coffeegram
  });
});

router.post('/coffeegrams/:id', async ctx => {
  var coffeegram = await Coffeegram.findById(ctx.params.id);
  if (coffeegram.userId.toString() !== ctx.state.currentUser.id) {
    ctx.request.flash('error', "You're not allowed to edit someone else's coffeegram");
    return ctx.redirect('back');
  }

  var params = pick(ctx.request.body, ['description', 'shop']);
  params = mapValues(params, clean);
  Object.assign(coffeegram, params);

  await coffeegram.save();

  ctx.request.flash('success', "Your new Coffeegram is updated");
  ctx.redirect(`/coffeegrams/${coffeegram.id}`);
});

router.post('/users/:username', async ctx => {
  var user = await User.findOne({ username: ctx.params.username });
  if (!user) {
    throw new NotFound();
  }
  if (user.id !== ctx.state.currentUser.id) {
    ctx.request.flash('error', "You're not allowed to edit someone else's profile");
    return ctx.redirect('back');
  }

  var params = pick(ctx.request.body, ['bio']);
  params = mapValues(params, clean);
  Object.assign(user, params);

  await user.save();

  ctx.redirect(`/users/${user.username}`);
});

module.exports = router;
