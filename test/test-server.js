const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const should = chai.should();

chai.use(chaiHttp);

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Moods} = require('../models');

function generateNewEntry() {
  return {
    date: "2018-03-31T22:24:23.312Z",
    mood: 5,
    moodTypes: ["great", "happy"],
    sleep: 5,
    eating: 5,
    exercise: "yes",
    notes: "Today was great. I created a bunch of tests"
  }
}

function generateEntriesData() {
  return [
    {
    date: "2018-03-30T22:24:23.312Z",
    moodTypes: ["hopeful"],
    mood: 4,
    sleep: 1,
    eating: 3,
    exercise: "no",
    notes: "Went swimmming today"
   },
   {
    date: "2018-03-29T22:24:23.312Z",
    moodTypes: ["sad"],
    mood: 3,
    sleep: 1,
    eating: 3,
    exercise: "no",
    notes: ""
   },
   {
    date: "2018-03-28T22:24:23.312Z",
    moodTypes: ["silly"],
    mood: 3,
    sleep: 1,
    eating: 5,
    exercise: "yes",
    notes: "test data"
   }
 ]
}

function seedEntriesData() {
  console.warn('Seeding database');
  const seedData = generateEntriesData();
  console.log(seedData);
  return Moods.insertMany(seedData);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('/api/entries', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });
  beforeEach(function() {
    return seedEntriesData();
  });
  afterEach(function() {
    return tearDownDb();
  });
  after(function() {
    return closeServer();
  });

  // describe('GET endpoint', function() {
  //
  //   it('should return all existing entries', function() {
  //   let res;
  //   return chai.request(app)
  //     .get('/api/entries')
  //     .then(function(_res) {
  //       // so subsequent .then blocks can access resp obj.
  //       res = _res;
  //       res.should.have.status(200);
  //       res.body.moods.should.have.length.of.at.least(1);
  //       return Moods.count();
  //     })
  //     .then(function(count) {
  //       res.body.moods.should.have.length.of(count);
  //     });
  //   });
  // });
  //
  // describe('POST endpoint', function() {
  //
  //   it('should add a new entry', function() {
  //   const newEntry = generateNewEntry();
  //   return chai.request(app)
  //     .post('/api/entries')
  //     .send(newEntry)
  //     .then(function(res) {
  //       console.log('**********"res.body"********** ', res.body);
  //       res.should.have.status(201);
  //       res.should.be.json;
  //       res.body.should.be.a('object');
  //       res.body._id.should.not.be.null;
  //       res.body.mood.should.equal(newEntry.mood);
  //       res.body.moodTypes.should.equal(newEntry.moodTypes);
  //       res.body.sleep.should.equal(newEntry.sleep);
  //       res.body.eating.should.equal(newEntry.eating);
  //       res.body.exercise.should.equal(newEntry.exercise);
  //       res.body.notes.should.equal(newEntry.notes);
  //       return Moods.findById(res.body._id);
  //     })
  //     .then(function(entry) {
  //       moods.mood.should.equal(newEntry.mood);
  //       moods.moodTypes.should.equal(newEntry.moodTypes);
  //       moods.sleep.should.equal(newEntry.sleep);
  //       moods.eating.should.equal(newEntry.eating);
  //       moods.exercise.should.equal(newEntry.exercise);
  //       moods.notes.should.equal(newEntry.notes);
  //     });
  //   });
  // });

})
