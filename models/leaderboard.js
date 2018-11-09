const mongoose = require('mongoose');

const leaderBoardSchema = mongoose.Schema({
    user: String,
    timestart: {
        hour: Number,
        min: Number,
        sec: Number,
    },
    timedesert: {
        hour: Number,
        min: Number,
        sec: Number,
    },
    timepyramid: {
        hour: Number,
        min: Number,
        sec: Number,
    },
    timemessyroom: {
        hour: Number,
        min: Number,
        sec: Number,
    },
    timepuzzle: {
        hour: Number,
        min: Number,
        sec: Number,
    },
});

module.exports = mongoose.model('Time', leaderBoardSchema);
