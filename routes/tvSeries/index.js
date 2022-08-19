const tvSeriesPlugin = require('../../services/tvSeries');

const tvSeriesSchema = {
  $id: 'TVSeries',
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
  fastify.register(tvSeriesPlugin);

  fastify.addSchema(tvSeriesSchema);

  fastify.get('/', {
    schema: {
      description: 'Default series end-point',
      tags: ['tvSeries'],
    },
  }, async () => 'This is an tv series');

  fastify.get('/random', {
    schema: {
      description: 'get random tv series',
      tags: ['tvSeries'],
      response: {
        200: {
          description: 'Success response',
          $ref: 'TVSeries#',
        },
      },
    },
  }, async () => fastify.tvSeries.getRandomTVSeries());

  fastify.post('/current', {
    schema: {
      description: 'get current series',
      tags: ['tvSeries'],
      response: {
        200: {
          description: 'Success response',
          $ref: 'TVSeries#',
        },
      },
    },
  }, async () => fastify.tvSeries.getCurrentTVSeries());

  fastify.get('/query/:expression', {
    schema: {
      description: 'search into all tv series',
      tags: ['tvSeries'],
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
            $ref: 'TVSeries#',
          },
        },
      },
    },
  }, async (request) => {
    const { expression } = request.params;

    return fastify.tvSeries.searchTVSeries(expression);
  });
};
