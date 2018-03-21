'use strict';

const mongoose = require('mongoose');

const moodsSchema = mongoose.Schema({
    date: {type: Date, required: true, default: Date.now()},
    mood: {type: Number},
    moodTypes: [{type: String}],
    sleep: {type: Number},
    eating: {type: Number},
    exercise: {type: String},
    notes: {type: String}
});

const Moods = mongoose.model('Moods', moodsSchema);

module.exports = {Moods};
