const { NotFound } = require('./error');

var handleNotFound = async (ctx, next) => {
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
}

module.exports = handleNotFound;
