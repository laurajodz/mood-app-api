'use strict';

const mongoose = require('mongoose');

const moodsSchema = mongoose.Schema({
    date: {type: Date, required: true},
    mood: {type: Number},
    moodTypes: [{type: String}],
    sleep: {type: Number},
    eating: {type: Number},
    exercise: {type: Boolean},
    notes: {type: String}
});

const Moods = mongoose.model('Moods', moodsSchema);

module.exports = {Moods};
