const fp = require('fastify-plugin');
const sensible = require('@fastify/sensible');

module.exports = fp(async (fastify) => {
  fastify.register(sensible, {
    errorHandler: false,
  });
});
