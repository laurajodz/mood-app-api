const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();

const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const {Moods} = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.use(bodyParser.json());

app.get('/api/entries', (req, res) => {
    Moods
      .find()
      .then(moods => {
          res.json(moods);
      })
      .catch(error => {
          res.status(500).json({message: 'Internal server error on get entries'});
      })
});

app.post('/api/entries', (req, res) => {
    Moods
        .create({
            date: req.body.date,
            mood: req.body.mood,
            moodTypes: req.body.moodTypes,
            sleep: req.body.sleep,
            eating: req.body.eating,
            exercise: req.body.exercise,
            notes: req.body.notes
        })
        .then(mood => {
            return mood.save();
        })
        .then(mood => {
            res.status(201).json(mood);
        })
        .catch(error => {
            res.status(500).json({message: 'Internal server error on post entry'});
        })
});

app.put('/api/entries/:id', jsonParser, (req, res) => {

    const toUpdate = {};
    const updateableFields = ["mood", "moodTypes", "sleep", "eating", "exercise", "notes"];

    updateableFields.forEach(field => {
    if (field in req.body) {
        toUpdate[field] = req.body[field];
    }
  });

    Moods
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(mood => res.status(204).end())
        .catch(error => res.status(500).json({message: 'Internal server error on put entry'}));
});

app.get('/api/*', (req, res) => {
    res.json([]);
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
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
