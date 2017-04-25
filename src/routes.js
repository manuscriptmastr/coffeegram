const Router = require('koa-router');
const { User, Coffeegram } = require('./database');
const { NotFound } = require('./error');
const path = require('path');
const { clean } = require('underscore.string');
const { pick, mapValues } = require('lodash');
const { validateImage } = require('./validation');

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
  var { image, description, type, shop } = ctx.request.body;

  description = clean(description);
  type = clean(type);
  shop = clean(shop);

  var coffeeParams = {
    image,
    description,
    type,
    shop
  }

  var errors = validateImage(coffeeParams);

  if (Object.keys(errors).length) {
    return await ctx.render('new', ({ errors, coffeeParams }));
  }

  var success = false;
  try {
    await Coffeegram.create({
      userId: ctx.state.currentUser.id,
      image: path.basename(image[0].path),
      description,
      type,
      shop
    });
    success = true;
  } catch (error) {
    if (error.name === "ValidationError") {
      await ctx.render('new', { errors: error.errors, coffeeParams });
    } else {
      throw error;
    }
  }
  if (success) {
    ctx.request.flash('success', "Your new Coffeegram is up");
    ctx.redirect(`/users/${ctx.state.currentUser.username}`);
  }
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
  if (!coffeegram) {
    throw new NotFound();
  }
  if (!coffeegram.userId.equals(ctx.state.currentUser.id)) {
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
