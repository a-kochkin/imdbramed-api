const https = require('https');
const htmlparser2 = require('htmlparser2');
const CSSselect = require('css-select');

module.exports = ({
  hostname,
  port,
  maxRedirects,
}) => {
  const getTitleFrames = (tconst) => {
    const options = {
      method: 'GET',
      hostname,
      port,
      path: `/title/${tconst}/mediaindex?refine=still_frame`,
      headers: {},
      maxRedirects,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const chunks = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();

          const dom = htmlparser2.parseDocument(body);
          const tag = CSSselect.selectOne('script[type=application/ld+json]', dom);
          const [{ data }] = tag.children;

          let frames = [];

          try {
            frames = JSON.parse(data).image.map(({ contentUrl }) => contentUrl);
          } catch {
            // do nothing
          }

          resolve(frames);
        });

        res.on('error', (error) => {
          reject(error);
        });
      });

      req.end();
    });
  };

  return {
    getTitleFrames,
  };
};
