const fp = require('fastify-plugin');
const swagger = require('@fastify/swagger');

module.exports = fp(async (fastify) => {
  fastify.register(swagger, {
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'IMDBramed',
        description: 'IMDBramed',
        version: '0.1.0',
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'movie', description: 'Movie related end-points' },
      ],
    },
    exposeRoute: true,
  });
});
