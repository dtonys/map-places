import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    // NOTE: Add custom route handling logic here
    // server.get('/a', (req, res) => {
    //   return app.render(req, res, '/b', req.query);
    // });

    server.get('/hello', (req, res) => {
      return res.send('hello');
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) {
        throw err;
      }
      console.log('> Ready on http://localhost:3000'); // eslint-disable-line no-console
    });
  });
