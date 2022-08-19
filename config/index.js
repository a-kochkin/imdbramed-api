module.exports = {
  db: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      user: 'imdb_user',
      password: 'imdb_password',
      database: 'imdb',
    },
  },
  imdb: {
    method: 'GET',
    hostname: 'www.imdb.com',
    port: 443,
    maxRedirects: 20,
  },
};
