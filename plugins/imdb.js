const fp = require('fastify-plugin');
const imdb = require('../imdb');
const config = require('../config');

module.exports = fp(async (fastify, opts, next) => {
  fastify.decorate('imdb', imdb(config.imdb));
  next();
});
