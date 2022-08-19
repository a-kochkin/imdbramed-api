const path = require('path');
const AutoLoad = require('@fastify/autoload');
const fastifyCors = require('@fastify/cors');

module.exports = async function (fastify, opts) {
  fastify.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
};
