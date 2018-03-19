const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {CLIENT_ORIGIN} = require('./config');
const app = express();

const {PORT, DATABASE_URL} = require('./config');
const {Moods} = require('./models');

mongoose.Promise = global.Promise;

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(bodyParser.json());

app.get('/api/*', (req, res) => {
  res.json({ok: true});
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
