const fp = require('fastify-plugin');
const { getRandomSix } = require('../utils');

const Movie = (db, imdb) => {
  const searchMovie = (expression) => {
    const tsquery = db.raw("websearch_to_tsquery('simple', ?)", [`"${expression}"`]);

    return db('movie')
      .select(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .select(db.raw('ts_rank("tsvectorTitle", ?)', [tsquery]))
      .where('tsvectorTitle', '@@', tsquery)
      .orderBy('numVotes', 'desc', 'last')
      .limit(10);
  };

  const getRandomMovie = async () => {
    const movie = await db('movie')
      .first(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .orderByRaw('random()');

    const { tconst } = movie;

    const frames = await imdb.getTitleFrames(tconst);

    return {
      ...movie,
      frames: getRandomSix(frames),
    };
  };

  const getCurrentMovie = async () => {
    let published = await db('movie')
      .first(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .where({ published: db.raw('now()::date') });

    if (!published) {
      const prePublished = db('movie')
        .select(['tconst'])
        .whereNull('published')
        .orderByRaw('random()')
        .limit(1);

      [published] = await db('movie')
        .update({ published: db.raw('now()::date') })
        .where('tconst', prePublished)
        .returning(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published']);
    }

    const { tconst } = published;

    const frames = await imdb.getTitleFrames(tconst);

    return {
      ...published,
      frames: getRandomSix(frames),
    };
  };

  return {
    searchMovie,
    getRandomMovie,
    getCurrentMovie,
  };
};

module.exports = fp((fastify, options, next) => {
  fastify.decorate('movie', Movie(fastify.db, fastify.imdb));
  next();
});
