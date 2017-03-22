var flash = async (ctx, next) => {
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
};

module.exports = flash;
