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
      host: 'imdbramed-api.herokuapp.com',
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'tvSeries', description: 'TV series related end-points' },
      ],
    },
    exposeRoute: true,
  });
});
