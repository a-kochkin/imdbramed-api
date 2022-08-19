const moviePlugin = require('../../services/movie');

const movieSchema = {
  $id: 'Movie',
  type: 'object',
  required: ['tconst'],
  properties: {
    tconst: {
      type: 'string',
      description: 'Identifier',
    },
    russianTitle: {
      type: 'string',
      description: 'Russian title',
    },
    englishTitle: {
      type: 'string',
      description: 'English title',
    },
    startYear: {
      type: 'string',
      description: 'Production year',
    },
    genres: {
      type: 'string',
      description: 'Genres',
    },
    published: {
      type: 'string',
      format: 'date',
      description: 'Publish date',
    },
    frames: {
      type: 'array',
      description: 'Frames',
      items: {
        type: 'string',
        format: 'uri',
        description: 'Frame',
      },
    },
  },
};

module.exports = async function (fastify) {
  fastify.register(moviePlugin);

  fastify.addSchema(movieSchema);

  fastify.get('/', {
    schema: {
      description: 'Default end-point',
      tags: ['movie'],
    },
  }, async () => 'This is an movie');

  fastify.get('/random', {
    schema: {
      description: 'get random movie',
      tags: ['movie'],
      response: {
        200: {
          description: 'Success response',
          $ref: 'Movie#',
        },
      },
    },
  }, async () => fastify.movie.getRandomMovie());

  fastify.post('/current', {
    schema: {
      description: 'get current movie',
      tags: ['movie'],
      response: {
        200: {
          description: 'Success response',
          $ref: 'Movie#',
        },
      },
    },
  }, async () => fastify.movie.getCurrentMovie());

  fastify.get('/query/:expression', {
    schema: {
      description: 'search into all movies',
      tags: ['movie'],
      params: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'Expression for search. For examples "Leon The Professional" or "Inception". You can also SearchMovie with year (ex: "Inception 2010")',
          },
        },
      },
      response: {
        200: {
          description: 'Success response',
          type: 'array',
          items: {
            $ref: 'Movie#',
          },
        },
      },
    },
  }, async (request) => {
    const { expression } = request.params;

    return fastify.movie.searchMovie(expression);
  });
};
