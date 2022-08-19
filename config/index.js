module.exports = {
  db: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
  imdb: {
    hostname: process.env.IMDB_HOSTNAME,
    port: process.env.IMDB_PORT,
    maxRedirects: process.env.IMDB_MAX_REDIRECTS,
  },
};
