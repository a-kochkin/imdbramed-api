const fp = require('fastify-plugin');
const knex = require('knex');
const config = require('../config');

module.exports = fp(async (fastify, opts, next) => {
  fastify.decorate('db', knex(config.db));
  next();
});
