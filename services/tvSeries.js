const fp = require('fastify-plugin');
const { getRandomSix } = require('../utils');

const TVSeries = (db, imdb) => {
  const searchTVSeries = (expression) => {
    const tsquery = db.raw("websearch_to_tsquery('simple', ?)", [`"${expression}":*`]);

    return db('tvSeries')
      .select(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .select(db.raw('ts_rank("tsvectorTitle", ?)', [tsquery]))
      .where('tsvectorTitle', '@@', tsquery)
      .orderBy('numVotes', 'desc', 'last')
      .limit(10);
  };

  const getRandomTVSeries = async () => {
    const movie = await db('tvSeries')
      .first(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .orderByRaw('random()');

    const { tconst } = movie;

    const frames = await imdb.getTitleFrames(tconst);

    return {
      ...movie,
      frames: getRandomSix(frames),
    };
  };

  const getCurrentTVSeries = async () => {
    let published = await db('tvSeries')
      .first(['tconst', 'russianTitle', 'englishTitle', 'startYear', 'genres', 'published'])
      .where({ published: db.raw('now()::date') });

    if (!published) {
      const prePublished = db('tvSeries')
        .select(['tconst'])
        .whereNull('published')
        .orderByRaw('random()')
        .limit(1);

      [published] = await db('tvSeries')
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
    searchTVSeries,
    getRandomTVSeries,
    getCurrentTVSeries,
  };
};

module.exports = fp((fastify, options, next) => {
  fastify.decorate('tvSeries', TVSeries(fastify.db, fastify.imdb));
  next();
});
